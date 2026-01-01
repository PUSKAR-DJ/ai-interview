// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword, role });

  const token = jwt.sign(
    { id: user._id, role: user.role, departmentId: user.departmentId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,       // not accessible to JS (prevents XSS)
    secure: true,         // https only (required in production)
    sameSite: "None",   // CSRF protection CHANGED: 'strict' -> 'None' to allow cross-domain cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ message: "User Registered", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role, departmentId: user.departmentId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,       // not accessible to JS (prevents XSS)
    secure: true,         // https only (required in production)
    sameSite: "None",   // CSRF protection CHANGED: 'strict' -> 'None' to allow cross-domain cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.json({ message: "Login Successful" });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/"
  });
  return res.json({ message: "Logged out" });
};
