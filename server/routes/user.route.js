import express from "express";
import { addMember, getAllMembers } from "../controllers/member.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add_member", verifyToken, addMember);

router.get("/allMembers", verifyToken, getAllMembers);

export default router;
