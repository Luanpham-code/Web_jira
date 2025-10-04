// import { axiosCustom } from "../service/config";

// export const authService = {
//   login: (data) => axiosCustom.post("/Users/signin", data),
//   signup: (data) => axiosCustom.post("/Users/signup", data),
// };

import axios from "axios";

export const authService = {
  login: (data) => {
    return axios.post(
      "https://jiranew.cybersoft.edu.vn/api/Users/signin",
      data,
      {
        headers: {
          TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8"  // ⚡ phải có token của Cybersoft cấp
        },
      }
    );
  },
};