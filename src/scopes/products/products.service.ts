import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { type Model, Types } from "mongoose";
import { CreateProductDto, QueryProductDto } from "./dto/create-product.dto";
import type { PriceDto } from "./dto/price.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  create(dto: CreateProductDto) {
    return new this.productModel(dto).save();
  }

  async findAll(query: QueryProductDto) {
    const filter: Record<string, any> = {};

    if (query.category) {
      filter.categoryId = new Types.ObjectId(query.category);
    }

    if (query.brand) {
      filter.brandId = new Types.ObjectId(query.brand);
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: "i" };
    }

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, query.limit ?? 20);
    const skip = (page - 1) * limit;

    const [items, _total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate("categoryId")
        .populate("brandId")
        // .skip(skip)
        // .limit(limit)
        .exec(),

      this.productModel.countDocuments(filter),
    ]);

    return items;
    // return {
    //   items,
    //   // total,
    //   // page,
    //   // totalPages: Math.ceil(total / limit),
    // };
  }

  async findOne(id: string): Promise<Product> {
    const doc = await this.productModel
      .findById(id)
      .populate("categoryId")
      .populate("brandId")
      .exec();
    if (!doc) throw new NotFoundException(`Category #${id} not found`);
    return doc;
  }

  // Get price for one client type
  async findPriceForType(productId: string, typeKey: string) {
    const product = await this.findOne(productId);
    const price = product.prices.get(typeKey.toLowerCase());
    if (!price)
      throw new NotFoundException(`No price set for client type "${typeKey}"`);

    return price;
  }

  // Set/update price for one client type — validated + atomic
  async setPriceForType(productId: string, typeKey: string, price: PriceDto) {
    const key = typeKey.toLowerCase();
    const updated = await this.productModel
      .findByIdAndUpdate(
        productId,
        { $set: { [`prices.${key}`]: price } },
        { returnDocument: "after" },
      )
      .populate("categoryId")
      .populate("brandId");
    if (!updated) throw new NotFoundException("Product not found");
    return updated;
  }

  async removePriceForType(productId: string, typeKey: string) {
    const key = typeKey.toLowerCase();
    const updated = await this.productModel
      .findByIdAndUpdate(
        productId,
        { $unset: { [`prices.${key}`]: "" } },
        { returnDocument: "after" },
      )
      .populate("brandId")
      .populate("categoryId");

    if (!updated) throw new NotFoundException("Product not found");
    return updated;
  }

  //
  update(id: string, dto: UpdateProductDto): Promise<Product | null> {
    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v != null),
    );

    return this.productModel
      .findByIdAndUpdate(id, cleanDto, { returnDocument: "after" })
      .populate("categoryId")
      .populate("brandId")
      .exec();
  }

  remove(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async findAllAvailable(
    ids: string[],
  ): Promise<(Product & { _id: Types.ObjectId })[]> {
    const docs = await this.productModel
      .find({ _id: { $in: ids }, isAvailable: true })
      .populate("categoryId")
      .populate("brandId")
      .lean();

    return docs as (Product & { _id: Types.ObjectId })[];
  }

  async findCounts() {
    const counts = await this.productModel.aggregate([
      { $project: { keys: { $objectToArray: "$prices" } } },
      { $unwind: "$keys" },
      { $group: { _id: "$keys.k", count: { $sum: 1 } } },
    ]);
    return counts;
  }

  async decrementStock(productId: string, quantity: number) {
    const result = this.productModel
      .findOneAndUpdate(
        {
          _id: productId,
          stockQuantity: { $gte: quantity },
        },
        { $inc: { stockQuantity: -quantity } },
      )
      .exec();

    return result;
  }
}
