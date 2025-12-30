import api from "./axios";

// --- Departments ---
export const getDepartments = async () => {
  const response = await api.get("/admin/departments");
  return response.data;
};

export const createDepartment = async (name) => {
  const response = await api.post("/admin/departments", { name });
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/admin/departments/${id}`);
  return response.data;
};

// --- Users (Candidates/HR) ---
export const getUsers = async (role) => {
  // role is optional, e.g. 'hr' or 'student'
  const url = role ? `/admin/users?role=${role}` : "/admin/users";
  const response = await api.get(url);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/admin/users", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};