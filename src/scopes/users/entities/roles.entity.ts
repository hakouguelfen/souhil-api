import { Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";

export type RoleDocument = HydratedDocument<Role>;

@Schema({ toJSON: { virtuals: true } })
export class Role {
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.virtual("id").get(function() {
  return (this._id as Types.ObjectId).toHexString();
});
