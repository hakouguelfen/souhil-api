import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";
import mongoose from "mongoose";
import { Role } from "./roles.entity";
import { User } from "./user.entity";

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema({ toJSON: { virtuals: true }, collection: "user_roles" })
export class UserRole {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
    required: true,
    index: true,
  })
  roleId: mongoose.Types.ObjectId;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
UserRoleSchema.virtual("id").get(function() {
  return (this._id as Types.ObjectId).toHexString();
});
