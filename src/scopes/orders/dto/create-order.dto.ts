import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OrderItemDto {
  @ApiProperty({ example: "XXXXID", description: "The product id" })
  productId: string;

  @ApiProperty({ example: "XXXXID", description: "category name" })
  category: string;

  @ApiProperty({ example: "XXXXID", description: "brand name" })
  brand: string;

  @ApiPropertyOptional({
    example: "http://image",
    description: "The product quantity",
  })
  imageUrl?: string;

  @ApiProperty({ example: "2", description: "The product quantity" })
  unitQuantity?: number;

  @ApiProperty({ example: "2", description: "The product quantity" })
  boxQuantity?: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: () => OrderItemDto,
    isArray: true,
    description: "List of order items",
  })
  items: OrderItemDto[];

  @ApiProperty({
    example: "Arris",
    description: "The delivery qddress of user",
  })
  deliveryAddress: string;

  @ApiProperty({
    example: "11.42",
    description: "The latitude",
  })
  phone: string;

  @ApiProperty({
    example: "11.42",
    description: "The latitude",
    required: false,
  })
  shop: string;

  @ApiProperty({
    example: "11.42",
    description: "The latitude",
    required: false,
  })
  latitude: number;

  @ApiProperty({
    example: "12.44",
    description: "The longitude",
    required: false,
  })
  longitude: number;

  @ApiProperty({
    example: "Arris",
    description: "The delivery qddress of user",
  })
  clientTypeKey: string;

  @ApiProperty({
    example: "2",
    description: "Some nets regarding the order",
    required: false,
  })
  notes?: string;
}

export class QueryOrderDto {
  @ApiPropertyOptional({ example: "milk", description: "product name" })
  status?: string;

  @ApiPropertyOptional({ example: "milk", description: "product name" })
  orderId?: string;

  @ApiPropertyOptional({ example: "milk", description: "product name" })
  search?: string;

  @ApiPropertyOptional({ example: "milk", description: "product name" })
  page?: number;

  @ApiPropertyOptional({ example: "milk", description: "product name" })
  limit?: number;
}
