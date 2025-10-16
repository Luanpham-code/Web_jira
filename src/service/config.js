// src/service/config.js
import axios from "axios";
import { message } from "antd";

// 🧩 Token Cybersoft — key chung cho mọi request
const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";

// 🌐 Cấu hình axios mặc định
export const axiosCustom = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn/api",
  headers: {
    "Content-Type": "application/json",
    TokenCybersoft: TOKEN_CYBERSOFT,
  },
});

// 🔒 Interceptor thêm Bearer Token tự động
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

// ⚠️ Interceptor xử lý lỗi response chung
axiosCustom.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          message.error("Dữ liệu không hợp lệ (400)");
          break;
        case 401:
          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("accessToken");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
          break;
        case 403:
          message.error("Bạn không có quyền truy cập (403)");
          break;
        case 404:
          message.error("Không tìm thấy dữ liệu (404)");
          break;
        case 500:
          message.error("Lỗi máy chủ (500)");
          break;
        default:
          message.error(`Lỗi không xác định: ${status}`);
      }
    } else {
      message.error("Không thể kết nối đến máy chủ!");
    }
    return Promise.reject(error);
  }
);
