import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import sendResponse from "../lib/responseHelper.js";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    console.log("Registration attempt");
    const { username, password } = req.body;

    if (!username || !password) {
      return sendResponse(res, 400, "Username and password are required");
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return sendResponse(res, 400, "Username is already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    });

    console.log("User registered successfully");
    sendResponse(res, 201, "User registered successfully");
  } catch (error) {
    console.error("User registration failed", error);
    sendResponse(res, 500, "User registration failed");
  }
};

export const login = async (req, res) => {
  try {
    console.log("login attempt");

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return sendResponse(res, 401, "Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, 401, "Invalid username or password");
    }

    //generate token
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );

    const { password: userPassword, ...userInfo } = user;

    return sendResponse(res, 200, "login success", { token, userInfo });
  } catch (error) {
    console.log("login failed error", error.message);
    sendResponse(res, 500, "Login failed");
  }
};

export const logout = (req, res) => {
  sendResponse(res, 200, "logout success");
};
