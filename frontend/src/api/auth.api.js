import api from "./axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getProfile = async () => {
  // Matches Backend: router.get("/profile", ...)
  const response = await api.get("/auth/profile");
  return response.data; // Returns { user: { role, interviewStatus, ... } }
};