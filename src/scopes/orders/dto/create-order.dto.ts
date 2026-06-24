import { ApiProperty } from "@nestjs/swagger";

export class OrderItemDto {
  @ApiProperty({ example: "XXXXID", description: "The product id" })
  productId: string;

  @ApiProperty({ example: "2", description: "The product quantity" })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: "list of order items" })
  items: OrderItemDto[];

  @ApiProperty({
    example: "Arris",
    description: "The delivery qddress of user",
  })
  deliveryAddress: string;

  @ApiProperty({ example: "2", description: "Some nets regarding the order" })
  notes?: string;
}
