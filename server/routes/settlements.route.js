import express from "express";
import {
  createSettlement,
  getSettlements,
} from "../controllers/dailyCollectionSettlement.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createSettlement);
router.get("/", verifyToken, getSettlements);

export default router;
