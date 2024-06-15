import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getAllReceivedPayments,
  getPaymentsByDate,
} from "../controllers/payments.controller.js";

const router = express.Router();

router.get("/receivedPayments", verifyToken, getAllReceivedPayments);
router.get("/paymentsByDate/:date", verifyToken, getPaymentsByDate);

export default router;
