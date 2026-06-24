import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1. Build the OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle("My API Docs")
    .setDescription("The API description for my NestJS application")
    .setVersion("1.0")
    .addBearerAuth() // Optional: if you use JWT auth
    .build();

  // 2. Create the document
  const document = SwaggerModule.createDocument(app, config);

  // 3. Setup the Swagger UI route (e.g., localhost:3000/api)
  SwaggerModule.setup("/api/openapi", app, document);

  await app.listen(3030);
  // await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
