import { PartialType } from "@nestjs/mapped-types";
import type { OrderStatus } from "../entities/order.entity";
import { CreateOrderDto } from "./create-order.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  status: OrderStatus;
}
