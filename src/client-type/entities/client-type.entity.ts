import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type mongoose from "mongoose";

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ClientType {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  key: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  active: boolean;
}

export const ClientTypeSchema = SchemaFactory.createForClass(ClientType);

ClientTypeSchema.virtual("id").get(function() {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});
