// interview.api.js
export const getInterview = (id) =>
  api.get(`/interviews/${id}`);
