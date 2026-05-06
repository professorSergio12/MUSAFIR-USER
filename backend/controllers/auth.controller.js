import bcrypt from "bcryptjs";
import {
  enqueueSignupEmail,
  enqueueResetPasswordEmail,
} from "../queues/email.queue.js";
import { welcomeEmailHtml } from "../utils/emailTemplates.js";
import User from "../models/auth.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { z } from "zod";

const signupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20, "Username must be between 3 and 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Required password is 8 characters long"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const { error } = signupSchema.safeParse(req.body);
  if (error) {
    const err = JSON.parse(error.message);
    console.log(err);
    return next(errorHandler(400, err[0].message));
  }

  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();

    await enqueueSignupEmail(email, username, welcomeEmailHtml(username));
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }
  const { error } = signinSchema.safeParse(req.body);
  if (error) {
    const err = JSON.parse(error.message);
    return next(errorHandler(400, err[0].message));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(errorHandler(400, "Wrong password"));
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    const { password: pwd, ...rest } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .status(200)
      .json({
        ...rest,
        role: user.role,
      });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
      );
      const { password, ...rest } = user._doc;

      await enqueueSignupEmail(email, name, welcomeEmailHtml(name));

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({ ...rest, role: user.role });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
      );
      const { password, ...rest } = newUser._doc;

      await enqueueSignupEmail(email, name, welcomeEmailHtml(name));

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({ ...rest, role: newUser.role });
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    // console.log(otp);
    await enqueueResetPasswordEmail(email, user.username, otp);

    redisClient.set(`otp${email}`, otp, "EX", 60 * 5);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(errorHandler(400, "All fields are required"));
  }
  const storedOTP = await redisClient.get(`otp${email}`);
  if (storedOTP !== otp) {
    return next(errorHandler(400, "Invalid OTP"));
  }
  res.status(200).json({ message: "OTP verified" });
};

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

export const logout = async (req, res, next) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Logged out successfully" });
};
