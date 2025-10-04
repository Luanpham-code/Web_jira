

import { axiosCustom } from "./config";

export const projectService = {
  getListProject: () => axiosCustom.get("/Project/getAllProject"),

  deleteProject: (id) => {
    // return axiosCustom.delete(`/Project/deleteProject?projectId=${id}`);
    return axiosCustom.delete(`/Project/deleteProject?projectId={idProject}`);
  },
};