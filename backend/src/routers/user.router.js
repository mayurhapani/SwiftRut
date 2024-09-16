import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { imageUpload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

// Define your routes here

userRouter.post(
  "/register",
  imageUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export { userRouter };
