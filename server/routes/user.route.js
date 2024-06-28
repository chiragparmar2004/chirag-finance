import express from "express";
import {
  addMember,
  dashboardDetails,
  getAllMembers,
  getSingleMember,
} from "../controllers/member.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addMoneyTransaction,
  getFilteredTransactions,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/add_member", verifyToken, addMember);

router.get("/allMembers", verifyToken, getAllMembers);

router.get("/:memberId", verifyToken, getSingleMember);

router.get("/get", verifyToken, dashboardDetails);

router.post("/addMoneyTransaction", verifyToken, addMoneyTransaction);

router.get(
  "/moneyTransaction/filtered-transactions",
  verifyToken,
  getFilteredTransactions
);

export default router;
