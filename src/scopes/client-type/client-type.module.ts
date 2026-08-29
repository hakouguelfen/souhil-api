import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsModule } from "../products/products.module";
import { CloudinaryService } from "../../shared/cloudinary.service";
import { ClientTypeController } from "./client-type.controller";
import { ClientTypeService } from "./client-type.service";
import { ClientType, ClientTypeSchema } from "./entities/client-type.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientType.name, schema: ClientTypeSchema },
    ]),
    ProductsModule,
  ],
  controllers: [ClientTypeController],
  providers: [ClientTypeService, CloudinaryService],
  exports: [ClientTypeService],
})
export class ClientTypeModule { }
