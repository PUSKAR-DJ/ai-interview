import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { 
  getAdminOverview, 
  createDepartment, 
  getAllDepartments, 
  deleteDepartment, 
  createUser, 
  deleteUser, 
  getUsers 
} from "../controllers/adminController.js";
import { getCandidateInterview } from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware, isAdmin);

router.get("/overview", getAdminOverview);

// Department Routes
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);
router.delete("/departments/:id", deleteDepartment);

// User Routes
router.get("/users", getUsers);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);

router.get("/interviews/:id", getCandidateInterview); // :id is the candidate's User ID

export default router;