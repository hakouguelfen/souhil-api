import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { type Model, Types } from "mongoose";
import { ProductsService } from "../products/products.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order, OrderItem, OrderStatus } from "./entities/order.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productsService: ProductsService,
  ) { }

  genOrderNumber() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const prefix =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)];

    const number = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    return `${prefix}${number}`;
  }

  async create(userId: string, dto: CreateOrderDto) {
    // const client = await this.clientModel.findById(userId);

    // Fetch all products in one query
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.productsService.findAllAvailable(productIds);
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const insufficientStock: string[] = [];
    dto.items.forEach((item) => {
      const product = productMap.get(item.productId);

      if ((product?.stockQuantity ?? 0) < item.quantity) {
        insufficientStock.push(
          `"${product?.name}" — requested ${item.quantity}, available ${product?.stockQuantity}`,
        );
      }
    });

    // Raise an error
    if (insufficientStock.length > 0) {
      throw new BadRequestException(
        `Insufficient stock: ${insufficientStock.join("; ")}`,
      );
    }

    // Add a guard before building order items
    if (products.length !== productIds.length) {
      throw new NotFoundException(
        "One or more products not found or unavailable",
      );
    }

    // Build Order
    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.productId);
      // const price = product?.prices.get(client.typeKey);

      return {
        productId: new Types.ObjectId(item.productId),
        name: product?.name,
        quantity: item.quantity,
        unitPrice: product?.prices.get("shop")!.unitPrice,
      } as OrderItem;
    });
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    // Decrement Stock

    for (const item of dto.items) {
      const result = await this.productsService.decrementStock(item);
      if (!result) {
        // Another request grabbed the last stock between our check and now
        const product = productMap.get(item.productId);
        throw new BadRequestException(
          `"${product?.name}" just went out of stock. Please update your cart.`,
        );
      }
    }

    return this.orderModel.create({
      userId: new Types.ObjectId(userId),
      clientTypeKey: "shop", // client.typeKey
      orderNumber: this.genOrderNumber(),
      items: orderItems,
      totalAmount,
      notes: dto.notes,
      status: OrderStatus.PENDING,
      deliveryAddress: dto.deliveryAddress,
    });
  }

  findAll(status: string): Promise<Order[]> {
    const filter: any = {};
    if (status && status.toLowerCase() !== "all") {
      filter.status = status;
    }

    return this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("userId")
      .exec();
  }

  findByUser(userId: string, status: string): Promise<Order[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (status && status.toLowerCase() !== "all") {
      filter.status = status;
    }

    return this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("userId")
      .exec();
  }

  async findOneByUser(id: string, userId: string): Promise<Order> {
    const doc = await this.orderModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .populate("userId")
      .exec();

    if (!doc) throw new NotFoundException(`Order #${id} not found`);
    return doc;
  }

  async findOne(id: string): Promise<Order> {
    const doc = await this.orderModel
      .findById(id)
      .sort({ createdAt: -1 })
      .populate("userId")
      .exec();

    if (!doc) throw new NotFoundException(`Order #${id} not found`);
    return doc;
  }

  update(id: string, dto: UpdateOrderDto): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate("userId")
      .exec();
  }

  async updateStatus(id: string, dto: UpdateOrderDto): Promise<Order> {
    const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.OUT_FOR_DELIVERY],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const doc = await this.orderModel.findById(id).populate("userId").exec();
    if (!doc) throw new NotFoundException(`Order #${id} not found`);

    const allowed = VALID_TRANSITIONS[doc.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from "${doc.status}" to "${dto.status}"`,
      );
    }

    doc.status = dto.status;
    return doc.save();
  }

  remove(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
