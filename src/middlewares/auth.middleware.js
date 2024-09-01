import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { User } from "../model/user.model.js";

const jwtAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized user");
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodeToken) {
      throw new ApiError(401, "Unauthorized user");
    }
    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid user");
    }
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid user" + error);
  }
};

export { jwtAuth };
