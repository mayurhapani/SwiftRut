import { Router } from "express";
import {
  registerUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

// Define your routes here

userRouter.post("/register", registerUser);
userRouter.delete("/delete/:_id", deleteUser);
userRouter.patch("/update/:_id", updateUser);

export { userRouter };
