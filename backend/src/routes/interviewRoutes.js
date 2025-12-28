import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isStudent } from "../middlewares/roleMiddleware.js";
import { startInterview, submitInterview, getMyInterview } from "../controllers/interviewController.js";

const router = express.Router();

router.use(authMiddleware, isStudent);

router.post("/start", startInterview);
router.post("/submit", submitInterview);
router.get("/me", getMyInterview); // Fetches result/history

export default router;