import api from "./axios";

export const getQuestions = (deptId = "") => {
    let url = "/questions";
    if (deptId) url += `?departmentId=${deptId}`;
    return api.get(url);
};

export const createQuestion = (data) => api.post("/questions", data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);
