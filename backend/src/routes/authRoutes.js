// routes/authRoutes.js
import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
