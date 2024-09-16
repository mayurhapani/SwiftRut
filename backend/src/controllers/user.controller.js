import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details
  const { username, email, fullName, password } = req.body;

  //validation error
  if (
    [username, email, fullName, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Username validation: must be at least 3 characters long
  if (username.length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters long");
  }

  // Email validation: must match the email pattern
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Password validation: must include at least one capital letter, one lowercase letter, one digit, one special character, and be at least 8 characters long
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
    );
  }

  //check if user already exist //email/username
  const existedUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser)
    throw new ApiError(409, "User with email or username already exists");

  //files //avatar and cover image
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverLocalPath;
  if (
    req.file &&
    Array.isArray(req.file.coverImage) &&
    req.file.coverImage.length > 0
  ) {
    coverLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new ApiError(400, "Avatar image path not found");

  //upload files to cloudinary server
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  //create user object and create db entry
  const user = await userModel.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  //remove password and refresh token from response
  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

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
