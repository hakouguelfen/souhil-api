import { writeFileSync } from "node:fs";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle("Grocery API")
    .setDescription("REST API for the grocery ordering app (cash on delivery)")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync("./openapi.json", JSON.stringify(document, null, 2));
  console.log("openapi.json written to project root");

  await app.close();
}

generate();
