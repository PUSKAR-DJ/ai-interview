import express from "express";
import multer from "multer";
import {
    submitInterview,
    getInterviewResult,
    checkInterviewStatus,
    generateDynamicQuestions,
    getAllInterviews
} from "../controllers/interviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

import os from 'os';

// Configure Multer (Temp Storage for Vercel compatibility)
const upload = multer({ dest: os.tmpdir() });

// All routes are protected
router.use(authMiddleware);

router.post('/submit', upload.single('audio'), submitInterview);
router.get('/status', checkInterviewStatus);
router.get('/result', getInterviewResult);
router.get('/me', getInterviewResult);
router.get('/questions', generateDynamicQuestions);
router.get('/all-completed', getAllInterviews);

export default router;