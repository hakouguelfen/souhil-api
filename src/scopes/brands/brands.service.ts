import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import type { CreateBrandDto } from "./dto/create-brand.dto";
import type { UpdateBrandDto } from "./dto/update-brand.dto";
import { Brand } from "./entities/brand.entity";

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) { }

  create(dto: CreateBrandDto): Promise<Brand> {
    return new this.brandModel(dto).save();
  }

  findAll(): Promise<Brand[]> {
    return this.brandModel
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "brandId",
            as: "products",
          },
        },
        {
          $addFields: {
            productCount: { $size: "$products" },
          },
        },
        {
          $project: {
            products: 0,
          },
        },
      ])
      .project({
        id: { $toString: "$_id" },
        name: 1,
        productCount: 1,
        imageUrl: 1,
      })
      .exec();
  }

  async findOne(id: string): Promise<Brand> {
    const doc = await this.brandModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Brand #${id} not found`);
    return doc;
  }

  update(id: string, dto: UpdateBrandDto): Promise<Brand | null> {
    return this.brandModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  remove(id: string): Promise<Brand | null> {
    return this.brandModel.findByIdAndDelete(id).exec();
  }
}
