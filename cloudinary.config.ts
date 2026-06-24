import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,

  cloud_name: "s7hl7snx",
  api_key: "444893941999928",
  api_secret: "g1-q_gJy5RBUGVtesYUe3J9CxkY",
});

export default cloudinary;
