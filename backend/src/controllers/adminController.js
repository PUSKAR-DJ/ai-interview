import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";
import { parseCSV } from "../utils/csvParser.js";
import fs from "fs";
import path from "path";

export const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, questions } = req.body;
    
    // Validate required fields
    if (!title || !description || !requiredSkills?.length || !questions?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const newJob = new Job({ title, description, requiredSkills, questions });
    await newJob.save();
    
    res.status(201).json({ 
      message: "Job created successfully",
      job_id: newJob._id,
      job: newJob 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const bulkUploadCandidates = async (req, res) => {
  try {
    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { job_role_id } = req.body;
    
    if (!job_role_id) {
      // Clean up file if job_role_id is missing
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
      return res.status(400).json({ message: "job_role_id is required" });
    }

    // Parse CSV file
    const csvData = await parseCSV(req.file.path);
    
    let totalProcessed = 0;
    let addedCount = 0;
    let duplicateCount = 0;

    // Loop through CSV data
    for (const candidateData of csvData) {
      totalProcessed++;
      
      // Check if candidate email already exists
      const existingCandidate = await Candidate.findOne({ email: candidateData.email });
      
      if (existingCandidate) {
        duplicateCount++;
        continue;
      }

      // Create new candidate with status 'Invited'
      const newCandidate = new Candidate({
        name: candidateData.name,
        email: candidateData.email,
        phone: candidateData.phone,
        job_role_id: job_role_id,
        status: "Invited"
      });

      await newCandidate.save();
      addedCount++;
    }

    // Delete temporary CSV file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    res.status(200).json({
      message: `${totalProcessed} candidates processed, ${addedCount} added, ${duplicateCount} duplicates skipped.`,
      totalProcessed,
      addedCount,
      duplicateCount
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};