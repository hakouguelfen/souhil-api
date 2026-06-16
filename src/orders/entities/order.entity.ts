import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

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
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  unit_price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    index: true,
  })
  status: string;

  delivery_address: string;
  notes: string;

  @Prop({ required: true })
  total_amount: number;

  placed_at: string;
  updated_at: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
