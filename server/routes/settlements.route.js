import express from "express";
import {
  getSettlementByDate,
  getSettlements,
  getTransactionHistoryBySettlementId,
  getUserDueSettlements,
  updateSettlement,
} from "../controllers/dailyCollectionSettlement.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/update/:id", verifyToken, updateSettlement);
router.get("/get", verifyToken, getSettlements);
router.get("/settlementByDate/:date", verifyToken, getSettlementByDate);
router.get("/dueSettlements", verifyToken, getUserDueSettlements);
router.get(
  "/history/:settlementId",
  verifyToken,
  getTransactionHistoryBySettlementId
);

export default router;
