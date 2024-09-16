import { taskModel } from "../models/task.model.js";
import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addTask = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.user._id;

  //validation error
  if ([title, description, category].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const newTask = await taskModel.create({
    title,
    description,
    category,
    createdBy: userId,
  });

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while adding task");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "New Task added successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const task = await taskModel.findOne({ _id });

  if (!task) throw new ApiError(402, "Task not found");

  const deletedTask = await taskModel.findOneAndDelete({ _id });

  return res
    .status(101)
    .json(new ApiResponse(101, "Task deleted successfully"));
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

export { addTask, deleteTask, updateTask };
