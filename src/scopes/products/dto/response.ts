import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  sellingPrice: number;

  @ApiProperty()
  stockQuantity: number;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty({ nullable: true, required: false })
  imageUrl?: string;

  @ApiProperty({ nullable: true, required: false })
  description?: string;
}
