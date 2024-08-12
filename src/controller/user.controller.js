import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import { verifyGoogleToken } from "../utils/verifyGoogleToken.js"; // Path to your utility function

import { User } from "../model/user.model.js";

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "This email is already register us");
  }
  const newUser = await User.create({ name, email, password });
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found with this email");
  }
  const isCorrect = await user.isPasswordValid(password);

  if (!isCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        201,
        { loggedIn, accessToken, refreshToken },
        "Successfully logged in"
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const userId = req.params.user_id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  user.password = password;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(201, {}, "Update password successfully"));
});

const googleSignin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  console.log(idToken);
  try {
    const payload = await verifyGoogleToken(idToken);
    // Handle user creation or login here using payload data
    // Example: check if user exists, create new user, generate JWT, etc.

    res
      .status(200)
      .json({ message: "Successfully signed in with Google", user: payload });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Google Sign-In failed", error: error.message });
  }
});

export { createUser, loginUser, resetPassword, googleSignin };
