import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryService } from "src/shared/cloudinary.service";
import { BrandsController } from "./brands.controller";
import { BrandsService } from "./brands.service";
import { Brand, BrandSchema } from "./entities/brand.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [BrandsController],
  providers: [BrandsService, CloudinaryService],
})
export class BrandsModule { }
