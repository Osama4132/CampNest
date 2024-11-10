import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

interface ICloudinaries {
  cloudinary: typeof cloudinary;
  storage: CloudinaryStorage;
}

interface IFolder {
  folder: string;
  allowed_formats: string[];
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CampNest",
    allowed_formats: ["jpeg", "png", "jpg"],
  } as IFolder,
});

const cloudinaries: ICloudinaries = {
  cloudinary,
  storage,
};

export default cloudinaries;
