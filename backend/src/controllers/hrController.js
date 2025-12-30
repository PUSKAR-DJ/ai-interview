import User from "../models/User.js";
import Department from "../models/Department.js"; // Optional, but usually good to have if needed
import Interview from "../models/Interview.js";
import bcrypt from "bcrypt";

export const getHROverview = async (req, res) => {
  try {
    const deptId = req.user.departmentId;
    if (!deptId) return res.status(400).json({ error: "HR not assigned to a department" });

    const totalDeptCandidates = await User.countDocuments({ role: "student", departmentId: deptId });
    const pendingInterviews = await User.countDocuments({ role: "student", departmentId: deptId, interviewStatus: "NOT_STARTED" });
    const completedInterviews = await User.countDocuments({ role: "student", departmentId: deptId, interviewStatus: "COMPLETED" });

    res.json({ totalDeptCandidates, pendingInterviews, completedInterviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeptCandidates = async (req, res) => {
  try {
    // Only fetch students in the HR's department
    const candidates = await User.find({
      role: "student",
      departmentId: req.user.departmentId
    }).select("-password");
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDeptCandidate = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      departmentId: req.user.departmentId, // Force assign to HR's dept
      interviewStatus: "NOT_STARTED"
    });

    res.status(201).json({ message: "Candidate created", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 1. Delete Candidate (Dept Scoped)
export const deleteDeptCandidate = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      departmentId: req.user.departmentId, // ENSURE they belong to HR's dept
      role: "student"
    });

    if (!user) return res.status(404).json({ message: "Candidate not found or not in your department" });
    res.json({ message: "Candidate deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. View Interview (Dept Scoped)
export const getDeptInterview = async (req, res) => {
  try {
    // Ensure the interview belongs to a candidate in HR's department
    const interview = await Interview.findOne({
      candidateId: req.params.id,
      departmentId: req.user.departmentId
    }).populate("candidateId", "name");

    if (!interview) return res.status(404).json({ message: "Interview not found or unauthorized" });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};