import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CloudinaryService } from "../../shared/cloudinary.service";
import { BrandsService } from "./brands.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { BrandResponseDto } from "./dto/response";
import { UpdateBrandDto } from "./dto/update-brand.dto";

// const jwt = JwtAuth({
//   audience: "web",
//   issuerBaseURL: "localhost:3000",
// });

@ApiTags("brands")
@ApiBearerAuth()
@Controller("brands")
// @UseGuards(new AuthGuard(jwt))
export class BrandsController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly brandsService: BrandsService,
  ) { }

  // Admin
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    operationId: "create",
    summary: "Place a new category (cash on delivery)",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["name", "image"],
      properties: {
        name: { type: "string", example: "milk" },
        image: {
          nullable: true,
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  @ApiResponse({
    status: 400,
    description: "Insufficient stock or invalid items",
  })
  @ApiResponse({ status: 404, description: "One or more products not found" })
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateBrandDto,
  ) {
    let imageUrl: string | undefined;

    if (image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        image,
        "brands",
      );
      imageUrl = uploadResult.secure_url;
    }

    return this.brandsService.create({
      ...dto,
      imageUrl: imageUrl,
    });
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
    type: [BrandResponseDto],
  })
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ operationId: "findOne", summary: "Get a single order by ID" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order found",
    type: BrandResponseDto,
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id") id: string) {
    return this.brandsService.findOne(id);
  }

  // Admin
  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiOperation({ operationId: "update", summary: "Get a single order by ID" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["name", "image"],
      properties: {
        name: { type: "string", example: "milk" },
        image: {
          nullable: true,
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Order updated" })
  @ApiResponse({ status: 404, description: "Order not updated" })
  async update(
    @Param("id") id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: UpdateBrandDto,
  ) {
    let secure_url = dto.imageUrl;

    if (image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        image,
        "brands",
      );
      secure_url = uploadResult.secure_url;
    }

    return this.brandsService.update(id, {
      ...dto,
      imageUrl: secure_url,
    });
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
    return this.brandsService.remove(id);
  }
}
