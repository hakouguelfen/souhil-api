import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument } from "mongoose";
import { Product } from "src/scopes/products/entities/product.entity";
import { User } from "src/scopes/users/entities/user.entity";

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DELIVERED = "delivered",
  OUT_FOR_DELIVERY = "out_for_delivery",
  CANCELLED = "cancelled",
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  productId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ toJSON: { virtuals: true } })
export class Order {
  @Prop({ required: true })
  orderNumber: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    index: true,
  })
  status: string;

  deliveryAddress: string;
  notes: string;

  @Prop({ required: true })
  totalAmount: number;

  placedAt: string;
  updatedAt: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.virtual("id").get(function() {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});
