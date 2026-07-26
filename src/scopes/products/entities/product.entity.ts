import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument } from "mongoose";
import { Category } from "src/scopes/categories/entities/category.entity";
import { type Price, PriceSchema } from "./price.entity";
import { Brand } from "src/scopes/brands/entities/brand.entity";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Product {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
    index: true,
  })
  categoryId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
    required: true,
    index: true,
  })
  brandId: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, default: 0, min: 0 })
  stockQuantity: number;

  @Prop({ unique: true, sparse: true, trim: true })
  sku?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: true, index: true })
  isAvailable: boolean;

  // key = ClientType.key, value = Price
  @Prop({ type: Map, of: PriceSchema, default: {} })
  prices: Map<string, Price>;
  // prices: Record<string, Price>;

  // @ApiProperty({
  //   type: "object",
  //   additionalProperties: { $ref: getSchemaPath(Price) },
  // })
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.set("toJSON", { flattenMaps: true, virtuals: true });
ProductSchema.set("toObject", { flattenMaps: true });

// Compound index for the most common query: available products in a category
ProductSchema.index({ categoryId: 1, isAvailable: 1 });
ProductSchema.index({ brandId: 1, isAvailable: 1 });

// Text index for search
ProductSchema.index({ name: "text", description: "text" });

ProductSchema.virtual("id").get(function() {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});
