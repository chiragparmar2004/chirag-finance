import express from "express";
import {
  addMember,
  dashboardDetails,
  getAllMembers,
  getMembersWithPendingEMIs,
  getSingleMember,
} from "../controllers/member.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add_member", verifyToken, addMember);

router.get("/allMembers", verifyToken, getAllMembers);

router.get("/:memberId", verifyToken, getSingleMember);

router.get("/get", verifyToken, dashboardDetails);

router.get("/pendingEmi", getMembersWithPendingEMIs);

export default router;
