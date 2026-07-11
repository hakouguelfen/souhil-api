import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ClientTypeService } from "./client-type.service";
import { CreateClientTypeDto } from "./dto/create-client-type.dto";
import { ClientTypeResponseDto } from "./dto/response";
import { UpdateClientTypeDto } from "./dto/update-client-type.dto";

@ApiTags("client-type")
@Controller("client-type")
export class ClientTypeController {
  constructor(private readonly clientTypeService: ClientTypeService) { }

  @Post()
  @ApiOperation({
    operationId: "create",
    summary: "Place a new category (cash on delivery)",
  })

  @ApiResponse({ status: 201, description: "Order created successfully" })
  @ApiResponse({
    status: 400,
    description: "Insufficient stock or invalid items",
  })
  @ApiResponse({ status: 404, description: "One or more products not found" })
  create(@Body() createClientTypeDto: CreateClientTypeDto) {
    return this.clientTypeService.create(createClientTypeDto);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateClientTypeDto })
  @ApiOperation({ operationId: "update", summary: "Get a single order by ID" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "Order updated" })
  @ApiResponse({ status: 404, description: "Order not updated" })
  update(@Param("id") id: string, @Body() dto: UpdateClientTypeDto) {
    return this.clientTypeService.update(id, dto);
  }

  @Get()
  @ApiOperation({
    operationId: "findAll",
    summary: "Get the current user's order history",
  })
  @ApiResponse({
    status: 200,
    description: "List of orders, most recent first",
    type: [ClientTypeResponseDto],
  })
  findAll(@Query("all") all?: string) {
    return this.clientTypeService.findAll(all !== "true");
  }

  @Get(":id")
  @ApiOperation({ operationId: "findOne", summary: "Get a single order by ID" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order found",
    type: ClientTypeResponseDto,
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id") id: string) {
    return this.clientTypeService.findOne(id);
  }

  @Patch(":key/deactivate")
  @ApiOperation({ operationId: "delete", summary: "Get a single order by ID" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order deleted",
  })
  @ApiResponse({ status: 404, description: "Order not updated" })
  deactivate(@Param("key") key: string) {
    return this.clientTypeService.deactivate(key);
  }
}
