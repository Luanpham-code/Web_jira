// import axios from "axios";

// export const axiosCustom = axios.create({
//   baseURL: "https://jiranew.cybersoft.edu.vn/api",
// });

// axiosCustom.interceptors.request.use((config) => {
//   // token khi login thành công (Users/signin) trả về, lưu vào localStorage
//   const token = localStorage.getItem("ACCESS_TOKEN");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // tokenCybersoft luôn cố định
//   config.headers.TokenCybersoft =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";

//   return config;
// });

// src/service/config.js
import axios from "axios";

export const axiosCustom = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn/api",
});

// 🧠 Interceptor để tự thêm token cho mọi request
axiosCustom.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken"); // token login khi đăng nhập
  const cybersoftToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.headers.TokenCybersoft = cybersoftToken;
  config.headers["Content-Type"] = "application/json";

  return config;
});
