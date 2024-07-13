import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
});
