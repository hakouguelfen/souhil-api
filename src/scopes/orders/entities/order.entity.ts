import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument } from "mongoose";
import { Product } from "../../products/entities/product.entity";
import { User } from "../../users/entities/user.entity";

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

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ required: false, min: 0 })
  unitQuantity?: number;

  @Prop({ required: false })
  unitPrice?: number;

  @Prop({ required: false, min: 0 })
  boxQuantity?: number;

  @Prop({ required: false })
  boxPrice?: number;
}
// {
//   name: "Steel Pipe 10mm",
//   prices: {
//     individual: { cost: 10, unitPrice: 15, cargoPrice: 2 },
//     shop:       { cost: 10, unitPrice: 12, cargoPrice: 1 },
//     factory:    { cost: 10, unitPrice: 9,  cargoPrice: 0 },
//     vip:        { cost: 10, unitPrice: 8,  cargoPrice: 0 }
//   }
// }

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  clientTypeKey: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    index: true,
  })
  status: string;

  @Prop({ type: String, required: true })
  deliveryAddress: string;

  @Prop({ type: String, required: false })
  phone?: string;

  @Prop({ type: String, required: false })
  shop?: string;

  @Prop({ required: false })
  latitude?: number;

  @Prop({ required: false })
  longitude?: number;

  @Prop({ type: String })
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
