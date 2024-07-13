import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existedUser = await User.findOne(email);
  if (existedUser) {
    throw new ApiError(400, "We have already register this email");
  }
  const newUser = await User.create({ name, email, password });
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});
