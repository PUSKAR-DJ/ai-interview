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

// Configure Multer (Temp Storage)
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists (Create if needed in server loop, but usually multer handles it or we ensure manual creation)
import fs from 'fs';
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// All routes are protected
router.use(authMiddleware);

router.post('/submit', upload.single('audio'), submitInterview);
router.get('/status', checkInterviewStatus);
router.get('/result', getInterviewResult);
router.get('/me', getInterviewResult);
router.get('/questions', generateDynamicQuestions);
router.get('/all-completed', getAllInterviews);

export default router;