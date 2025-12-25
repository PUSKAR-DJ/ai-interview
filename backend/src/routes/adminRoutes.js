import express from "express";
import { createJob, bulkUploadCandidates } from "../controllers/adminController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Create a new job role
router.post("/jobs", createJob);

// Upload candidates via CSV
router.post("/upload-candidates", upload.single("file"), bulkUploadCandidates);

export default router;
