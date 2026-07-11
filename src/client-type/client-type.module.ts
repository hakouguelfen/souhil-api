import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsModule } from "src/scopes/products/products.module";
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
  providers: [ClientTypeService],

  exports: [ClientTypeService], // <-- must export it
})
export class ClientTypeModule { }
