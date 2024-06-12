import jwt from "jsonwebtoken";
import sendResponse from "../lib/responseHelper";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return sendResponse(res, 401, "Not Authenticated");

  const token = authHeader.split("")[1];

  if (!token) return sendResponse(res, 401, "Not Authenticated!");

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return sendResponse(res, 403, "Token is not valid");
    req.userId = payload.id;
    next();
  });
};
