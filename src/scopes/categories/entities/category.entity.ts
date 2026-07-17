import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  imageUrl?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.virtual("id").get(function() {
  return (this._id as Types.ObjectId).toHexString();
});
