import api from "./axios";

// Backend: GET /api/admin/overview
export const getAdminStats = async () => {
  const response = await api.get("/admin/overview");
  return response.data;
};

// Backend: GET /api/hr/overview
export const getHRStats = async () => {
  const response = await api.get("/hr/overview");
  return response.data;
};