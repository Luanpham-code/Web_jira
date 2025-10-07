// src/service/projectService.js
import { axiosCustom } from "./config";

export const projectService = {
  getListProject: () => axiosCustom.get("/Project/getAllProject"),

  deleteProject: (id) =>
    axiosCustom.delete(`/Project/deleteProject?projectId=${id}`),

  getProjectDetail: (id) =>
    axiosCustom.get(`/Project/getProjectDetail?id=${id}`),

  updateProject: (id, data) =>
    axiosCustom.put(`/Project/updateProject?projectId=${id}`, data),
  
  addUserToProject: (data) => axiosCustom.post(`/Project/assignUserProject`, data),

   // Xóa thành viên ✅ (đúng theo Swagger bạn gửi)
  removeUserFromProject: (projectId, userId) =>
    axiosCustom.delete(`/Project/removeUserFromProject`, {
      data: { projectId, userId },
    }),
};