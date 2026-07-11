import { ApiProperty } from "@nestjs/swagger";

export class ClientTypeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  productCount: number;
}
