import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details
  const { name, email, password, role } = req.body;

  //validation error
  if ([name, email, role, password].some((fields) => fields?.trim() === "")) {
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
    role,
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

export { registerUser };
