import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ toJSON: { virtuals: true } })
export class User {
  @Prop({ required: true })
  username: string;
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual("id").get(function() {
  return (this._id as Types.ObjectId).toHexString();
});
