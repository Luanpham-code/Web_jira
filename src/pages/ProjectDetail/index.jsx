import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
 
const ProjectDetail = () => {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState(null);
 
  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const TOKEN_CYBERSOFT =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // token thật từ Cybersoft
 
        const res = await axios.get(
          `https://jiranew.cybersoft.edu.vn/api/Project/getProjectDetail?id=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              TokenCybersoft: TOKEN_CYBERSOFT,
            },
          }
        );
 
        setProjectDetail(res.data.content);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết project:", error);
      }
    };
 
    fetchProjectDetail();
  }, [projectId]);
 
  if (!projectDetail) return <p>Đang tải chi tiết dự án...</p>;
 
  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="text-gray-500 mb-2 text-sm">
        Project / CyberLearn / Project management /{" "}
        <span className="text-gray-700 font-medium">
          {projectDetail.projectName}
        </span>
      </div>
 
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">{projectDetail.projectName}</h1>
      <p className="text-gray-600 mb-6">{projectDetail.description}</p>
 
      {/* ======= Top Bar ======= */}
      <div className="flex items-center justify-between mb-6">
        {/* Search + Avatars */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Teng teng"
              className="border rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
            />
            <i className="fa fa-search absolute left-2 top-2 text-gray-400 text-sm"></i>
          </div>
 
          {/* Members (avatars initials) */}
          <div className="flex items-center -space-x-2">
            {projectDetail.members?.slice(0, 3).map((user) => (
              <div
                key={user.userId}
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-800 border-2 border-white"
                title={user.name}
              >
                {user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </div>
            ))}
          </div>
 
          {/* Add member button (optional) */}
          <button className="ml-2 text-gray-500 hover:text-gray-700">
            + Add
          </button>
        </div>
 
        {/* Filters */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="cursor-pointer hover:text-black">
            Only My Issues
          </span>
          <span className="cursor-pointer hover:text-black">
            Recently Updated
          </span>
        </div>
      </div>
 
      {/* ======= Task Columns ======= */}
      <div className="grid grid-cols-4 gap-4">
        {projectDetail.lstTask?.map((taskGroup, index) => (
          <div
            key={index}
            className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="font-semibold mb-3 text-gray-700 uppercase text-sm">
              {taskGroup.statusName}
            </h2>
 
            {/* Tasks in each column */}
            {taskGroup.lstTaskDeTail.map((task) => (
              <div
                key={task.taskId}
                className="bg-white p-2 mb-3 rounded border hover:shadow-md transition cursor-pointer"
              >
                <p className="font-medium">{task.taskName}</p>
                <p className="text-sm text-red-500">
                  {task.priorityTask?.priority}
                </p>
                <div className="flex gap-1 mt-2">
                  {task.assigness?.map((user) => (
                    <span
                      key={user.id}
                      className="bg-gray-300 rounded-full px-2 text-xs"
                    >
                      {user.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default ProjectDetail;
 