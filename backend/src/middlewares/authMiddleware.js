// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {

  console.log("Cookies:", req.cookies);
  console.log("Raw Cookie Header:", req.headers.cookie);

  const token =
    req.cookies?.token ||
    req.headers.cookie?.split("token=")[1]?.split(";")[0];

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("departmentId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export default authMiddleware;