import {
  Body,
  Controller,
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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CloudinaryService } from "../../shared/cloudinary.service";
import { ClientTypeService } from "./client-type.service";
import { CreateClientTypeDto } from "./dto/create-client-type.dto";
import { ClientTypeResponseDto } from "./dto/response";
import { UpdateClientTypeDto } from "./dto/update-client-type.dto";

@ApiTags("client-type")
@Controller("client-type")
export class ClientTypeController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly clientTypeService: ClientTypeService,
  ) { }

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
      required: ["key", "label", "active", "image"],
      properties: {
        key: { type: "string", example: "milk" },
        label: { type: "string", example: "milk" },
        active: { type: "boolean", example: "milk" },
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
    @Body() dto: CreateClientTypeDto,
  ) {
    let imageUrl: string | undefined;

    if (image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        image,
        "clientType",
      );
      imageUrl = uploadResult.secure_url;
    }

    return this.clientTypeService.create({
      ...dto,
      imageUrl: imageUrl,
    });
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiOperation({ operationId: "update", summary: "Get a single order by ID" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["label", "active", "image"],
      properties: {
        label: { type: "string", example: "milk" },
        active: { type: "boolean", example: "milk" },
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
    @Body() dto: UpdateClientTypeDto,
  ) {
    let secure_url = dto.imageUrl;

    if (image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        image,
        "clientType",
      );
      secure_url = uploadResult.secure_url;
    }

    return this.clientTypeService.update(id, {
      ...dto,
      imageUrl: secure_url,
    });
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
