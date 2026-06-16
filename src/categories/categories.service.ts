import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

  create(dto: CreateCategoryDto): Promise<Category> {
    return new this.categoryModel(dto).save();
  }

  findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec()
  }

  async findOne(id: string): Promise<Category> {
    const doc = await this.categoryModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Category #${id} not found`);
    return doc;
  }

  update(id: string, dto: UpdateCategoryDto): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(id, dto, { new: true }).exec()
  }

  remove(id: string): Promise<Category | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
