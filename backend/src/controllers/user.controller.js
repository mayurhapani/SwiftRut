import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  //get user details
  const { name, email, password } = req.body;
  // console.log(req.body);

  //validation error
  if ([name, email, password].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exist //email/username
  const existedUser = await userModel.findOne({ email });

  if (existedUser)
    throw new ApiError(409, "User with email or username already exists");

  //create user object and create db entry
  const user = await userModel.create({
    name,
    email,
    password,
  });

  //remove password and refresh token from response
  const createdUser = await userModel.findById(user._id).select("-password");

  //check user created or not
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }

  //return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  //get user details
  const { _id } = req.params;

  const user = await userModel.findOne({ _id });

  if (!user) throw new ApiError(402, "User not found");

  const deletedUser = await userModel.findOneAndDelete({ _id });

  return res
    .status(101)
    .json(new ApiResponse(101, "User deleted successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  console.log("hii");

  const { name, email } = req.body;
  const { _id } = req.params;

  // validation error
  const user = await userModel.findByIdAndUpdate(_id, {
    name,
    email,
  });

  if (!user) {
    throw new ApiError(402, "User not found");
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validation error
  if ([email, password].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // generate jwt token
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  } else {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // set jwt token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { user, token }, "User login successfully"));
  }
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "None",
  });

  //return response
  return res.status(200).json(new ApiResponse(200, "User login successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User data got successfully"));
});

export { registerUser, deleteUser, updateUser, login, logout, getUser };
