import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CloudinaryService } from "src/shared/cloudinary.service";
import { CreateProductDto, QueryProductDto } from "./dto/create-product.dto";
import { PriceDto } from "./dto/price.dto";
import { ProductResponseDto } from "./dto/response";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Price } from "./entities/price.entity";
import { ProductsService } from "./products.service";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productsService: ProductsService,
  ) { }

  // ── Public ────────────────────────────────────────────────────────────────
  @Get()
  @ApiExtraModels(Price)
  @ApiOperation({
    summary: "List products — supports category filter, search, pagination",
    operationId: "findAll",
  })
  @ApiQuery({ name: "brand", required: false, type: String })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Paginated list of available products",
    type: [ProductResponseDto],
  })
  findAll(@Query() query: QueryProductDto) {
    // NOTE Examples
    // GET /products                              → all available products
    // GET /products?brand=<id>                   → filter by brand
    // GET /products?category=<id>                → filter by category
    // GET /products?search=tomato                → search by name
    // GET /products?category=<id>&search=tomato  → both combined
    // GET /products?page=2&limit=10              → paginated
    return this.productsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a single product by ID",
    operationId: "findOne",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiResponse({
    status: 200,
    description: "Product found",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Get(":id/prices/:typeKey")
  @ApiOperation({
    summary: "Get a single product by ID",
    operationId: "findPrice",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiParam({ name: "typeKey", description: "Product ID" })
  @ApiResponse({
    status: 200,
    description: "Product found",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  getPrice(@Param("id") id: string, @Param("typeKey") typeKey: string) {
    // Get price for a specific client type — e.g. GET /products/:id/prices/shop
    return this.productsService.findPriceForType(id, typeKey);
  }

  // ── Admin ────────────────────────────────────────────────────────────────
  // Admin
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("admin")
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    summary: "Create a new product (admin only)",
    operationId: "create",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["categoryId", "brandId", "name", "stockQuantity", "image"],
      properties: {
        categoryId: { type: "string", example: "XXXXXID" },
        brandId: { type: "string", example: "XXXXXID" },
        name: { type: "string", example: "milk" },
        stockQuantity: { type: "number", example: 100 },
        description: { type: "string" },
        image: {
          nullable: true,
          type: "string",
          format: "binary", // ← this is what triggers @Part + MultipartFile
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Product created" })
  @ApiResponse({ status: 400, description: "Validation error" })
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    const uploadResult = await this.cloudinaryService.uploadImage(
      image,
      "products",
    );

    return this.productsService.create({
      ...dto,
      imageUrl: uploadResult.secure_url,
    });
  }

  // Admin
  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    summary: "Update a product (admin only)",
    operationId: "edit",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["brandId", "name", "stockQuantity", "image"],
      properties: {
        categoryId: { nullable: true, type: "string", example: "XXXXXID" },
        brandId: { nullable: true, type: "string", example: "XXXXXID" },
        name: { nullable: true, type: "string", example: "milk" },
        isAvailable: { nullable: true, type: "boolean", example: "false" },
        stockQuantity: { nullable: true, type: "number", example: 100 },
        description: { nullable: true, type: "string" },
        image: {
          nullable: true,
          type: "string",
          format: "binary", // ← this is what triggers @Part + MultipartFile
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Product updated",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  async update(
    @Param("id") id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: UpdateProductDto,
  ) {
    let secure_url = dto.imageUrl;

    if (image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        image,
        "products",
      );
      secure_url = uploadResult.secure_url;
    }

    return this.productsService.update(id, {
      ...dto,
      imageUrl: secure_url,
    });
  }

  @Patch(":id/prices/:typeKey")
  @ApiOperation({
    summary: "Update a product (admin only)",
    operationId: "setPrice",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiParam({ name: "typeKey", description: "client ID" })
  @ApiBody({ type: PriceDto })
  @ApiResponse({
    status: 200,
    description: "Product updated",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  setPrice(
    @Param("id") id: string,
    @Param("typeKey") typeKey: string,
    @Body() price: PriceDto,
  ) {
    return this.productsService.setPriceForType(id, typeKey, price);
  }

  @Delete(":id/prices/:typeKey")
  @ApiOperation({
    summary: "Update a product (admin only)",
    operationId: "removePrice",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiParam({ name: "typeKey", description: "client ID" })
  @ApiResponse({
    status: 200,
    description: "Product updated",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  removePrice(@Param("id") id: string, @Param("typeKey") typeKey: string) {
    return this.productsService.removePriceForType(id, typeKey);
  }

  // Admin
  @Delete(":id")
  @ApiOperation({
    summary: "Delete a product (admin only)",
    operationId: "delete",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiResponse({ status: 200, description: "Product deleted" })
  @ApiResponse({ status: 404, description: "Product not found" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
