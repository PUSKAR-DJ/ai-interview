import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isHR } from "../middlewares/roleMiddleware.js";
import { getHROverview, getDeptCandidates, createDeptCandidate } from "../controllers/hrController.js";
import { deleteDeptCandidate, getDeptInterview, updateDeptCandidate } from "../controllers/hrController.js";

const router = express.Router();

router.use(authMiddleware, isHR);

router.get("/overview", getHROverview);
router.get("/candidates", getDeptCandidates);
router.post("/candidates", createDeptCandidate);
router.put("/candidates/:id", updateDeptCandidate);

router.delete("/candidates/:id", deleteDeptCandidate);
router.get("/interviews/:id", getDeptInterview);

export default router;