// import { axiosCustom } from "../service/config";

// export const authService = {
//   login: (data) => axiosCustom.post("/Users/signin", data),
//   signup: (data) => axiosCustom.post("/Users/signup", data),
// };

import axios from "axios";
import { axiosCustom } from "./config";

export const authService = {
  login: (data) => {
    return axios.post(
      "https://jiranew.cybersoft.edu.vn/api/Users/signin",
      data,
      {
        headers: {
          TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTMiLCJIZXRIYW5TdHJpbmciOiIxMi8wNi8yMDI2IiwiSGV0SGFuVGltZSI6IjE3ODEyMjI0MDAwMDAiLCJuYmYiOjE3NjI4ODQwMDAsImV4cCI6MTc4MTM3MzYwMH0.ZxhiMsctm3eKMVBpn81V6ioC1EwaG05VEeMMv-ReXVA"  
        },
      }
    );
  },
  signup: (data) => axiosCustom.post("/Users/signup", data),
};