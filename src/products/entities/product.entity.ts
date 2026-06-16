import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";
import { Category } from "src/categories/entities/category.entity";

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
    index: true,
  })
  categoryId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, default: 0, min: 0 })
  stock_qty: number;

  @Prop({ default: false, index: true })
  is_available: boolean;

  @Prop()
  image_url?: string;

  @Prop({ trim: true })
  description?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Compound index for the most common query: available products in a category
ProductSchema.index({ categoryId: 1, isAvailable: 1 });

// Text index for search
ProductSchema.index({ name: "text", description: "text" });
