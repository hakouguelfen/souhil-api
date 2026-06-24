import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { type Model, Types } from "mongoose";
import type {
  CreateProductDto,
  QueryProductDto,
} from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
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

    if (query.search) {
      filter.name = { $regex: query.search, $options: "i" };
    }

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, query.limit ?? 20);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel.find(filter).skip(skip).limit(limit).exec(),
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
    const doc = await this.productModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Category #${id} not found`);
    return doc;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productModel.find({ categoryId }).populate("categoryId").exec();
  }

  update(id: string, dto: UpdateProductDto): Promise<Product | null> {
    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v != null),
    );

    return this.productModel
      .findByIdAndUpdate(id, cleanDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
