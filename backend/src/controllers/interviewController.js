import Interview from "../models/Interview.js";
import User from "../models/User.js";

export const startInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // 1. Prevent re-interview
    if (user.interviewStatus === "COMPLETED") {
      return res.status(400).json({ message: "Interview already completed" });
    }

    // 2. Find or Create Interview Session
    let interview = await Interview.findOne({ candidateId: userId });
    if (!interview) {
      interview = await Interview.create({
        candidateId: userId,
        departmentId: user.departmentId,
        status: "IN_PROGRESS"
      });
      
      // Update User status
      user.interviewStatus = "IN_PROGRESS";
      await user.save();
    }

    res.json({ message: "Interview started", interviewId: interview._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { questions, feedback } = req.body; 

    const interview = await Interview.findOne({ candidateId: userId });
    if (!interview) return res.status(404).json({ error: "Interview not found" });

    interview.questions = questions || [];
    interview.feedback = feedback || "";
    interview.status = "COMPLETED";
    interview.completedAt = new Date();
    await interview.save();

    // Mark user as COMPLETED (Locking them out of retaking)
    await User.findByIdAndUpdate(userId, { interviewStatus: "COMPLETED" });

    res.json({ message: "Interview submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyInterview = async (req, res) => {
  // Get my result
  try {
    const interview = await Interview.findOne({ candidateId: req.user.id });
    if (!interview) return res.status(404).json({ message: "No interview found" });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};