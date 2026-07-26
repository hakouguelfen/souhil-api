import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  imageUrl?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
BrandSchema.virtual("id").get(function() {
  return (this._id as Types.ObjectId).toHexString();
});
