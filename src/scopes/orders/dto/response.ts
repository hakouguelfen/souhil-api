import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}

export class OrderItemResponseDto {
  @ApiProperty({ example: "665f1c2e8b3f4a0012abcd34" })
  productId: string;

  @ApiProperty({ example: "Organic Bananas (1kg)" })
  name: string;

  @ApiProperty({ example: "Organic Bananas (1kg)" })
  imageUrl?: string;

  @ApiProperty({ example: 3, required: false })
  unitQuantity?: number;

  @ApiProperty({
    example: 2.49,
    description: "Price snapshot at time of order",
    required: false,
  })
  unitPrice?: number;

  @ApiProperty({ example: 3, required: false })
  boxQuantity?: number;

  @ApiProperty({
    example: 2.49,
    description: "Price snapshot at time of order",
    required: false,
  })
  boxPrice?: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: "665f9a1b2c3d4e5f6a7b8c9d" })
  id: string;

  @ApiProperty({ example: "AB214" })
  orderNumber: string;

  @ApiProperty({ type: UserResponseDto })
  userId: UserResponseDto;

  @ApiProperty({ example: "AB214" })
  clientTypeKey: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({
    example: "pending",
    enum: [
      "pending",
      "confirmed",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
  })
  status: string;

  @ApiProperty({ example: 14.97 })
  totalAmount: number;

  @ApiProperty({ example: "12 Baker Street, Apt 4, Springfield" })
  deliveryAddress: string;

  @ApiPropertyOptional({
    example: "12 Baker Street, Apt 4, Springfield",
    required: false,
  })
  latitude?: number;

  @ApiPropertyOptional({
    example: "12 Baker Street, Apt 4, Springfield",
    required: false,
  })
  longitude?: number;

  @ApiPropertyOptional({
    example: "Leave at the door, ring twice",
    required: false,
  })
  notes?: string;

  @ApiPropertyOptional({
    example: "2026-06-17T10:32:00.000Z",
    required: false,
    nullable: true,
  })
  createdAt?: string;

  @ApiPropertyOptional({
    example: "2026-06-17T10:32:00.000Z",
    required: false,
    nullable: true,
  })
  updatedAt?: string;
}
