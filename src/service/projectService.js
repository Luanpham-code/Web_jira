

import { axiosCustom } from "./config";

export const projectService = {
  getListProject: () => axiosCustom.get("/Project/getAllProject"),

  deleteProject: (id) => axiosCustom.delete(`/Project/deleteProject?projectId=${id}`),

  // 👉 Lấy chi tiết project theo ID
  getProjectDetail: (id) => axiosCustom.get(`/Project/getProjectDetail?id=${id}`),

  // 👉 Cập nhật project
  updateProject: (id, data) =>
    axiosCustom.put(`/Project/updateProject?projectId=${id}`, data),
};