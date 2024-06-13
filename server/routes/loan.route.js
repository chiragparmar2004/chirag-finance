import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addLoan,
  getLoanWithEMIs,
  getLoans,
} from "../controllers/loan.controller.js";

const router = express.Router();

// Route to add a loan to a member
router.post("/:memberId", verifyToken, addLoan);

// Route to get all loans for a member
router.get("/:memberId", verifyToken, getLoans);

// Route to get a specific loan with all EMIs
router.get("/details/:loanId", verifyToken, getLoanWithEMIs);

export default router;
