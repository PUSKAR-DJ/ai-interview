import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  audioUrl: { type: String }, // Cloudinary URL
  aiScore: { type: Number },
  aiAnalysis: { type: Object }, // JSON from Gemini
  feedback: { type: String },
  transcript: { type: Array, default: [] }
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);