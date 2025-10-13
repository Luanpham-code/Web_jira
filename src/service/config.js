import axios from "axios";

const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";

export const axiosCustom = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn/api",
  headers: {
    "Content-Type": "application/json",
    TokenCybersoft: TOKEN_CYBERSOFT,
  },
  withCredentials: false, 
});


axiosCustom.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("⚠️ accessToken chưa có trong localStorage!");
    }
    return config;
  },
  (error) => Promise.reject(error)
);