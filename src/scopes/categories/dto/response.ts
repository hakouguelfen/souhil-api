import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  productCount: number;

  @ApiProperty({ nullable: true, required: false })
  imageUrl?: string;
}
