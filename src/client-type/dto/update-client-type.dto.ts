import { ApiProperty } from "@nestjs/swagger";

export class UpdateClientTypeDto {
  @ApiProperty({ description: "The image of the user" })
  label: string;
}
