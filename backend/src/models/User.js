// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "hr", "student"],
    default: "student"
  },
  // HR and Students must belong to a department
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },
  // Tracks if the student has finished their one-time interview
  interviewStatus: {
    type: String,
    enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
    default: "NOT_STARTED"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);