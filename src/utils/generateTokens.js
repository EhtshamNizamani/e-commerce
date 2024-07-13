import { User } from "../model/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  console.log(user);
  if (!user) {
    throw new ApiError(400, "Invalid user");
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export { generateAccessAndRefreshToken };
