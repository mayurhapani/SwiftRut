import { taskModel } from "../models/task.model.js";
import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addTask = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.user._id;

  //validation error
  if ([title, description].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const newTask = await taskModel.create({
    title,
    description,
    category,
    createdBy: userId,
  });

  if (!newTask) {
    throw new ApiError(500, "something went wrong while adding task");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, newTask, "New Task added successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const task = await taskModel.findOne({ _id });

  if (!task) throw new ApiError(402, "Task not found");

  const deletedTask = await taskModel.findOneAndDelete({ _id });

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const { _id } = req.params;

  // validation error
  const task = await taskModel.findByIdAndUpdate(_id, {
    title,
    description,
    category,
  });

  if (!task) {
    throw new ApiError(402, "Post not found");
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task updated successfully"));
  }
});

const completeTask = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // validation error
  const isTask = await taskModel.findById(_id);
  if (!isTask) {
    throw new ApiError(402, "Post not found");
  }

  //task update as completed
  const task = await taskModel.findByIdAndUpdate(
    _id,
    { isCompleted: !isTask.isCompleted },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated"));
});

const getTasks = asyncHandler(async (req, res) => {
  const user = req.user;
  let tasks;

  if (user.role == "admin") {
    tasks = await taskModel.find({});
  } else {
    tasks = await taskModel.find({ createdBy: req.user._id });
  }

  return res.json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

export { addTask, deleteTask, updateTask, getTasks, completeTask };
