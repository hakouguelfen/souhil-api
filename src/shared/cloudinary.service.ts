// cloudinary.service.ts

import type { UploadApiResponse } from "cloudinary";
import cloudinary from "cloudinary.config";

export class CloudinaryService {
  async uploadImage(file: Express.Multer.File) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products",
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) {
              return reject(new Error("Upload failed"));
            }

            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
