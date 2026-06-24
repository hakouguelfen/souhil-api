import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument } from "mongoose";
import { Category } from "src/scopes/categories/entities/category.entity";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ toJSON: { virtuals: true } })
export class Product {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
    index: true,
  })
  categoryId: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  costPrice: number;

  @Prop({ required: true, min: 0 })
  sellingPrice: number;

  @Prop({ required: true, default: 0, min: 0 })
  stockQuantity: number;

  @Prop({ default: true, index: true })
  isAvailable: boolean;

  @Prop()
  imageUrl?: string;

  @Prop({ trim: true })
  description?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
console.log(ProductSchema.path("categoryId")?.instance);

// Compound index for the most common query: available products in a category
ProductSchema.index({ categoryId: 1, isAvailable: 1 });

// Text index for search
ProductSchema.index({ name: "text", description: "text" });

ProductSchema.virtual("id").get(function() {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});
