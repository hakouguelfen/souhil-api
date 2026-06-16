import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from "@nestjs/common";
import type { CreateOrderDto } from "./dto/create-order.dto";
import type { UpdateOrderDto } from "./dto/update-order.dto";
import type { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // JWT
  @Post()
  create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user_id, createOrderDto);
  }

  // JWT
  @Get()
  findAll(@Request() req: any) {
    return this.ordersService.findByUser(req.user_id);
  }
  // @Get()
  //  findAll(@Query('userId') userId?: string) {
  //    if (userId) return this.ordersService.findByUser(userId);
  //    return this.ordersService.findAll();
  //  }

  // JWT
  @Get(":id")
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.ordersService.findOne(id, req.user_id);
  }

  // JWT
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  // Admin
  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  // Admin
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersService.remove(id);
  }
}
