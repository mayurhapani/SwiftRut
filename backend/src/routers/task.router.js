import { Router } from "express";
import {
  addTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller.js";

const taskRouter = Router();

// Define your routes here

taskRouter.post("/register", addTask);
taskRouter.delete("/delete/:_id", deleteTask);
taskRouter.patch("/update/:_id", updateTask);

export { taskRouter };
