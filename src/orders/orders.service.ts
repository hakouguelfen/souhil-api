import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { type Model, Types } from "mongoose";
import {
  Product,
  type ProductDocument,
} from "src/products/entities/product.entity";
import type { CreateOrderDto } from "./dto/create-order.dto";
import type { UpdateOrderDto } from "./dto/update-order.dto";
import { Order, type OrderItem, OrderStatus } from "./entities/order.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(userId: string, dto: CreateOrderDto) {
    // Fetch all products in one query
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.productModel
      .find({ _id: { $in: productIds }, isAvailable: true })
      .lean();

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const insufficientStock: string[] = [];
    dto.items.forEach((item) => {
      const product = productMap.get(item.productId);

      if ((product?.stock_qty ?? 0) < item.quantity) {
        insufficientStock.push(
          `"${product?.name}" — requested ${item.quantity}, available ${product?.stock_qty}`,
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
      return {
        productId: new Types.ObjectId(item.productId),
        name: product?.name,
        quantity: item.quantity,
        unit_price: product?.price,
      } as OrderItem;
    });
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );

    // Decrement Stock

    for (const item of dto.items) {
      const result = this.productModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(item.productId),
            stock_qty: { $gte: item.quantity },
          },
          { $inc: { stock_qty: -item.quantity } },
        )
        .lean();
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
      items: orderItems,
      total_amount: totalAmount,
      notes: dto.notes,
      status: OrderStatus.PENDING,
      delivery_address: dto.deliveryAddress,
    });
  }

  findAll(): Promise<Order[]> {
    return this.orderModel.find().populate("userId").exec();
  }

  findByUser(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate("userId")
      .lean();
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const doc = await this.orderModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .populate("userId")
      .lean();

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
