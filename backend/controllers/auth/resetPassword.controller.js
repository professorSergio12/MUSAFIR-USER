import bcrypt from "bcryptjs";
import User from "../../models/auth.model.js";
import { errorHandler } from "../../utils/errorHandler.js";
import redisClient from "../../config/redis.js";
import { resetPasswordSchema } from "./schemas.js";

export const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = resetPasswordSchema.safeParse(req.body);
  if (error) {
    return next(errorHandler(400, error.message));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
    redisClient.del(`otp${email}`);
  } catch (error) {
    next(error);
  }
};
