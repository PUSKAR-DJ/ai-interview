import Interview from '../models/Interview.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import { analyzeInterview, generateQuestions } from '../services/geminiService.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const submitInterview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const candidateId = req.user.id || req.user._id; // Handle both cases just in case
    const messages = JSON.parse(req.body.messages || '[]');

    // 1. Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video", // "video" handles audio files in Cloudinary
      folder: "interviews",
      public_id: `interview_${candidateId}_${Date.now()}`
    });

    // Remove local file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const audioUrl = uploadResponse.secure_url;

    // 2. Trigger AI Analysis
    const analysis = await analyzeInterview(audioUrl, messages);

    // 3. Save to DB
    const interview = await Interview.create({
      candidateId,
      audioUrl,
      aiScore: analysis.score || 0,
      aiAnalysis: analysis,
      feedback: analysis.feedback || "Processed",
      status: 'Completed',
      endTime: new Date()
    });

    // Update user status
    await User.findByIdAndUpdate(candidateId, {
      $set: { interviewStatus: "COMPLETED" },
    });

    res.status(201).json({ message: "Interview submitted successfully", interview });

  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewResult = async (req, res) => {
  try {
    const interview = await Interview.findOne({ candidateId: req.user.id }).sort({ createdAt: -1 });
    if (!interview) return res.status(404).json({ message: "No interview found" });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkInterviewStatus = async (req, res) => {
  try {
    const interview = await Interview.findOne({ candidateId: req.user.id, status: 'Completed' });
    res.json({ completed: !!interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ status: 'Completed' })
      .populate({
        path: 'candidateId',
        select: 'name email departmentId',
        populate: {
          path: 'departmentId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateDynamicQuestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('departmentId');
    if (!user.departmentId) return res.status(400).json({ message: "No department assigned" });

    // Get Context Questions
    const questions = await Question.find({ departmentId: user.departmentId._id });
    const questionTexts = questions.map(q => q.text);

    // Generate via AI
    let dynamicQuestions = [];
    if (questionTexts.length > 0) {
      dynamicQuestions = await generateQuestions(user.departmentId.name, questionTexts);
    } else {
      // Fallback if no questions in DB
      dynamicQuestions = await generateQuestions(user.departmentId.name, ["Tell me about yourself", "What are your strengths?", "Why do you want to join us?"]);
    }

    res.json({
      department: user.departmentId.name,
      questions: dynamicQuestions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};