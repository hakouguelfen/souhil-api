import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryResponseDto } from "./dto/response";
import { UpdateCategoryDto } from "./dto/update-category.dto";

// const jwt = JwtAuth({
//   audience: "web",
//   issuerBaseURL: "localhost:3000",
// });

@ApiTags("categories")
@ApiBearerAuth()
@Controller("categories")
// @UseGuards(new AuthGuard(jwt))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // Admin
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
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  // @UseGuards(new RequireRoleGuard(jwt, ["admin"], ["reports:read"]))
  @ApiOperation({
    operationId: "findAll",
    summary: "Get the current user's order history",
  })
  @ApiResponse({
    status: 200,
    description: "List of orders, most recent first",
    type: [CategoryResponseDto],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ operationId: "findOne", summary: "Get a single order by ID" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order found",
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  // Admin
  @Patch(":id")
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOperation({ operationId: "update", summary: "Get a single order by ID" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "Order updated" })
  @ApiResponse({ status: 404, description: "Order not updated" })
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Admin
  @Delete(":id")
  @ApiOperation({ operationId: "delete", summary: "Get a single order by ID" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order deleted",
  })
  @ApiResponse({ status: 404, description: "Order not updated" })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
