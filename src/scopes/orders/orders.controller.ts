import { JwtAuth } from "@anzar-auth/server";
import { AuthGuard } from "@anzar-auth/server/nestjs";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderResponseDto } from "./dto/response";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersService } from "./orders.service";

const jwt = JwtAuth({
  audience: "customers",
  issuerBaseURL: "http://localhost:3000",
});

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // ── Admin ────────────────────────────────────────────────────────────────
  @Get("admin")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "findOrders",
    summary: "Get the current user's order history",
  })
  @ApiResponse({
    status: 200,
    description: "List of orders, most recent first",
    type: [OrderResponseDto],
  })
  findAll(@Query("status") status: string) {
    return this.ordersService.findAll(status);
  }

  @Get("admin/:id")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "findOrder",
    summary: "Get a single order by ID",
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order found",
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  // Admin
  @Patch(":id/status")
  @ApiBody({ type: UpdateOrderDto })
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "updateOrderStatus",
    summary: "Update order status (admin only)",
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Status updated",
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid status transition" })
  @ApiResponse({ status: 404, description: "Order not found" })
  updateStatus(@Param("id") id: string, @Body() body: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, body);
  }

  // Admin
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "deleteOrder",
    summary: "Delete an order (admin only)",
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "Order deleted" })
  @ApiResponse({ status: 404, description: "Order not found" })
  remove(@Param("id") id: string) {
    return this.ordersService.remove(id);
  }

  // JWT
  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "updateOrder",
    summary: "Update an order (e.g. address or notes, while pending)",
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "Order updated" })
  @ApiResponse({ status: 404, description: "Order not found" })
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  // ── Public ────────────────────────────────────────────────────────────────
  // JWT
  @Post()
  @UseGuards(new AuthGuard(jwt))
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "placeOrder",
    summary: "Place a new order (cash on delivery)",
  })
  @ApiResponse({ status: 201, description: "Order created" })
  @ApiResponse({
    status: 400,
    description: "Insufficient stock or invalid items",
  })
  @ApiResponse({ status: 404, description: "One or more products not found" })
  create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user_id, createOrderDto);
  }

  // JWT
  @Get()
  @UseGuards(new AuthGuard(jwt))
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "findUserOrders",
    summary: "Get the current user's order history",
  })
  @ApiResponse({
    status: 200,
    description: "List of orders, most recent first",
    type: [OrderResponseDto],
  })
  findUserOrders(@Request() req: any, @Query("status") status: string) {
    return this.ordersService.findByUser(req.user_id, status);
  }

  // JWT
  @Get(":id")
  @UseGuards(new AuthGuard(jwt))
  @ApiBearerAuth()
  @ApiOperation({
    operationId: "findUserOrder",
    summary: "Get a single order by ID",
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order found",
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  findUserOrder(@Request() req: any, @Param("id") id: string) {
    return this.ordersService.findOneByUser(id, req.user_id);
  }
}
