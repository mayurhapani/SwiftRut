import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFIlePath) => {
  try {
    if (!localFIlePath) return null;

    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFIlePath, {
      resource_type: "auto",
      folder: "chai or backend",
    });

    //file has been uploaded successful
    fs.unlinkSync(localFIlePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFIlePath); // remove file from local server if error
    return null;
  }
};

export { uploadOnCloudinary };
