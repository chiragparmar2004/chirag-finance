import express from "express";
import {
  getDashboardSummary,
  getRecentLoans,
  getRecentSettlements,
} from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Dashboard summary
router.get("/summary", verifyToken, getDashboardSummary);

// Recent loans
router.get("/recentLoans", verifyToken, getRecentLoans);

// Recent settlements
router.get("/recentSettlements", verifyToken, getRecentSettlements);

export default router;
