import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClientTypeModule } from "./client-type/client-type.module";
import { CategoriesModule } from "./scopes/categories/categories.module";
import { OrdersModule } from "./scopes/orders/orders.module";
import { ProductsModule } from "./scopes/products/products.module";
import { UsersModule } from "./scopes/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      "mongodb://hakou:password@localhost:27017/dev?authSource=admin",
    ),
    UsersModule,
    OrdersModule,
    ProductsModule,
    CategoriesModule,
    ClientTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
