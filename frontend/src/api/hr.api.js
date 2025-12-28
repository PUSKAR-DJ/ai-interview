import api from "./axios";

// Get candidates for the logged-in HR's department
export const getMyCandidates = async () => {
  const response = await api.get("/hr/candidates");
  return response.data;
};

// Create a candidate (backend auto-assigns department)
export const createCandidate = async (userData) => {
  const response = await api.post("/hr/candidates", userData);
  return response.data;
};

export const deleteCandidate = async (id) => {
  const response = await api.delete(`/hr/candidates/${id}`);
  return response.data;
};