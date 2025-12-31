import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isHR } from "../middlewares/roleMiddleware.js";
import {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from "../controllers/questionController.js";

const router = express.Router();

// All routes require authentication and Admin/HR role
router.use(authMiddleware, isHR);

router.get("/", getQuestions);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;
