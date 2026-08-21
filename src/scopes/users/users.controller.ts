import { JwtAuth } from "@anzar-auth/server";
import { AuthGuard } from "@anzar-auth/server/nestjs";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  AccountResponseDto,
  UserAccountsResponseDto,
} from "./dto/account_response.dto";
import { UsersService } from "./users.service";
import { UpdateAccountDto } from "./dto/update_account.dto";

const jwt = JwtAuth({
  audience: "customers",
  issuerBaseURL: "http://localhost:3000",
});

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("roles/:role")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "findNewUsers",
    summary: "Get the current user's order history",
  })
  @ApiParam({ name: "role", description: "Role name" })
  @ApiResponse({
    status: 200,
    description: "List of orders, most recent first",
    type: [UserAccountsResponseDto],
  })
  findAll(@Param("role") role: string) {
    return this.usersService.findAll(role);
  }

  @Get("account")
  @UseGuards(new AuthGuard(jwt))
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "findAccount",
  })
  @ApiResponse({
    status: 200,
    description: "Order updated",
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  findAccount(@Request() req: any) {
    return this.usersService.findAccount(req.user_id);
  }

  @Patch("account/:id")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "updateAccountVisibility",
  })
  @ApiBody({ type: UpdateAccountDto })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "Order updated" })
  @ApiResponse({ status: 404, description: "Order not found" })
  updateAccount(@Param("id") id: string, @Body() body: UpdateAccountDto) {
    return this.usersService.updateAccount(id, body);
  }
}
