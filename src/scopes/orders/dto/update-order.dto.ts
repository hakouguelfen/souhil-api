import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "../entities/order.entity";

export class UpdateOrderDto {
  @ApiProperty({
    example: "pending",
    enum: OrderStatus,
    enumName: "ApiOrderStatus",
    description: "order status",
  })
  status: OrderStatus;
}
