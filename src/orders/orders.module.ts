import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "src/products/entities/product.entity";
import { ProductsService } from "src/products/products.service";
import { Order, OrderSchema } from "./entities/order.entity";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ProductsService],
})
export class OrdersModule { }
