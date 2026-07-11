import { ApiProperty } from "@nestjs/swagger";

export class PriceDto {
  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  boxPrice: number;

  @ApiProperty()
  unitsPerBox: number;

  @ApiProperty()
  sellByUnit: boolean;

  @ApiProperty()
  sellByBox: boolean;
}
