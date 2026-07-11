import { ApiProperty } from "@nestjs/swagger";

export class CreateClientTypeDto {
  @ApiProperty({ example: "hakou", description: "The username of the user" })
  key: string;

  @ApiProperty({ description: "The image of the user" })
  label: string;

  @ApiProperty({ description: "The image of the user" })
  active: boolean;
}
