import express from "express";
import { addEMI, getEMIs } from "../controllers/emi.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Route to get all EMIs for a loan
router.get("/:loanId", verifyToken, getEMIs);

// Route to pay an EMI
router.post("/add/:loanId", verifyToken, addEMI);

export default router;
