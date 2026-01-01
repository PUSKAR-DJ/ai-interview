import User from "../models/User.js";
import Department from "../models/Department.js";
import Interview from "../models/Interview.js";
import bcrypt from "bcrypt";

// --- Dashboard Stats ---
export const getAdminOverview = async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({ role: "student" });
    const totalHRs = await User.countDocuments({ role: "hr" });
    const totalDepts = await Department.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: "Completed" });

    res.json({ totalCandidates, totalHRs, totalDepts, completedInterviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Department Management ---
export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const dept = await Department.create({ name });
    res.status(201).json(dept);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- User Management (HR & Students) ---
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, departmentId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      departmentId: departmentId || null
    });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).populate("departmentId", "name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, departmentId, password } = req.body;
    const updateData = { name, email, departmentId };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Interview.findOneAndDelete({ candidateId: userId });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCandidateInterview = async (req, res) => {
  try {
    // Find interview by the candidate's User ID
    const interview = await Interview.findOne({ candidateId: req.params.id })
      .populate("candidateId", "name email"); // Get candidate name

    if (!interview) return res.status(404).json({ message: "Interview not found for this candidate" });

    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};