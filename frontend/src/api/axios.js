// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true, // IMPORTANT if cookies are used
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // global error handling later
//     return Promise.reject(err);
//   }
// );

// export default api;

// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

export default api;
