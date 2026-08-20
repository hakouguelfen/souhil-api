import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";
import mongoose from "mongoose";
import { User } from "./user.entity";

export type AccountDocument = HydratedDocument<Account>;

@Schema({ toJSON: { virtuals: true } })
export class Account {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  locked: boolean;

  @Prop({ default: false })
  verified: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
AccountSchema.virtual("id").get(function() {
  return (this._id as Types.ObjectId).toHexString();
});
