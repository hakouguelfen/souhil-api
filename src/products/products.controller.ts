import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import type {
  CreateProductDto,
  QueryProductDto,
} from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
import type { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // ── Public ────────────────────────────────────────────────────────────────
  @Get()
  findAll(@Query() query: QueryProductDto) {
    // NOTE Examples
    // GET /products                              → all available products
    // GET /products?category=<id>                → filter by category
    // GET /products?search=tomato                → search by name
    // GET /products?category=<id>&search=tomato  → both combined
    // GET /products?page=2&limit=10              → paginated
    return this.productsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  // ── Admin ────────────────────────────────────────────────────────────────
  // Admin
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("admin")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Admin
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  // Admin
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
