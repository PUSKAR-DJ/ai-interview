import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // vital: enforces one interview per candidate
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  status: {
    type: String,
    enum: ["IN_PROGRESS", "COMPLETED"],
    default: "IN_PROGRESS"
  },
  questions: [{
    questionText: String,
    answerText: String,
    audioUrl: String // For voice answers
  }],
  remarks: [String], // HR remarks
  overallScore: { type: Number, default: 0 },
  feedback: String,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Interview", interviewSchema);