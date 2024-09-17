import { Router } from "express";
import {
  addTask,
  deleteTask,
  updateTask,
  completeTask,
  getTasks,
} from "../controllers/task.controller.js";
import { isAuth } from "../middlewares/isAuth.middleware.js";

const taskRouter = Router();

// Define your routes here

taskRouter.post("/register", isAuth, addTask);
taskRouter.delete("/delete/:_id", isAuth, deleteTask);
taskRouter.patch("/update/:_id", isAuth, updateTask);
taskRouter.patch("/complete/:_id", isAuth, completeTask);

taskRouter.get("/getTasks", isAuth, getTasks);

export { taskRouter };
