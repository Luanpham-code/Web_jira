import axios from "axios";

export const axiosCustom = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn/api",
  headers: {
    "Content-Type": "application/json",
    TokenCybersoft:
      "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJjeWJlcmxlYXJuQGdtYWlsLmNvbSIsIm5iZiI6MTc1OTcwMjEwOSwiZXhwIjoxNzU5NzA1NzA5fQ.QVKf5yFMTekwahqBsFXEWT0mW0zPQjB-nBKDTdmoTAY",
  },
});

// ✅ Interceptor thêm Authorization: Bearer <accessToken>
axiosCustom.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    console.warn("⚠️ accessToken chưa có trong localStorage!");
  }
  return config;
});