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

   
  removeUserFromProject: (projectId, userId) =>
    axiosCustom.delete(`/Project/removeUserFromProject`, {
      data: { projectId, userId },
    }),

  getUserByKeyword: (keyword) =>
  axiosCustom.get(`/Users/getUser?keyword=${keyword}`),

   getAllStatus: () => axiosCustom.get("/Status/getAll"),
  getAllPriority: () => axiosCustom.get("/Priority/getAll?id=0"),
  getAllTaskType: () => axiosCustom.get("/TaskType/getAll"),
  getAllUsers: () => axiosCustom.get("/Users/getUser"),
  createTask: (data) => axiosCustom.post("/Project/createTask", data),

};