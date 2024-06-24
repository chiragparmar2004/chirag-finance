import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getTransactionHistory } from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/transaction-history", verifyToken, getTransactionHistory);

export default router;
