import api from "./axios";

// Candidate: Start Session
export const startInterview = async () => {
  return api.post("/interview/start");
};

// Candidate: Submit Answers
export const submitInterview = async (data) => {
  return api.post("/interview/submit", data);
};

// Candidate: Get Own Result
export const getMyResult = async () => {
  return api.get("/interview/me");
};

// Admin/HR: Get Candidate History
// rolePrefix is 'admin' or 'hr'
export const getCandidateHistory = async (rolePrefix, candidateId) => {
  return api.get(`/${rolePrefix}/interviews/${candidateId}`);
};