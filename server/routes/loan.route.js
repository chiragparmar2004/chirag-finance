import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addLoan,
  getLoanWithEMIs,
  getLoans,
  getLoansByStatus,
  renewLoan,
} from "../controllers/loan.controller.js";
import { getPendingEmis } from "../controllers/member.controller.js";

const router = express.Router();

// Route to add a loan to a member
router.post("/addLoan/:memberId", verifyToken, addLoan);
router.post("/renew/:loanId", verifyToken, renewLoan);
// Route to get all loans for a member
router.get("/:memberId", verifyToken, getLoans);
router.get("/loans/:memberId/:status", verifyToken, getLoansByStatus);

// Route to get a specific loan with all EMIs
router.get("/details/:loanId", verifyToken, getLoanWithEMIs);

router.get("/memberList/pendingEmi", verifyToken, getPendingEmis);

export default router;
