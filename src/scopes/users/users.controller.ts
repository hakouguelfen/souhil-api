import { Controller, Get, Param, Patch } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { UserResponseDto } from "../orders/dto/response";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("accounts")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "findNewUsers",
    summary: "Get the current user's order history",
  })
  @ApiResponse({
    status: 200,
    description: "List of orders, most recent first",
    type: [UserResponseDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch("account/:id")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "activateAccount",
  })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "Order updated" })
  @ApiResponse({ status: 404, description: "Order not found" })
  activateAccount(@Param("id") id: string) {
    return this.usersService.updateAccount(id);
  }
}
