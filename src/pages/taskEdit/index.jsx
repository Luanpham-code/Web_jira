import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskEdit = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const token = localStorage.getItem("accessToken");

  // ===== FETCH TASK + COMMENTS =====
  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const res = await axios.get(
          `https://jiranew.cybersoft.edu.vn/api/Project/getTaskDetail?taskId=${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              TokenCybersoft: TOKEN_CYBERSOFT,
            },
          }
        );
        setTask(res.data.content);
      } catch (err) {
        console.error("Lỗi tải task:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `https://jiranew.cybersoft.edu.vn/api/Comment/getAll?taskId=${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              TokenCybersoft: TOKEN_CYBERSOFT,
            },
          }
        );
        setComments(res.data.content);
      } catch (err) {
        console.error("Lỗi tải comment:", err);
      }
    };

    fetchTaskDetail();
    fetchComments();
  }, [taskId]);

  
  const refreshComments = async () => {
    const res = await axios.get(
      `https://jiranew.cybersoft.edu.vn/api/Comment/getAll?taskId=${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          TokenCybersoft: TOKEN_CYBERSOFT,
        },
      }
    );
    setComments(res.data.content);
  };

  const handleAddComment = async () => {
    if (!content.trim()) return alert("Vui lòng nhập nội dung comment!");
    try {
      await axios.post(
        "https://jiranew.cybersoft.edu.vn/api/Comment/insertComment",
        { taskId, contentComment: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        }
      );
      setContent("");
      refreshComments();
    } catch (err) {
      console.error("Lỗi thêm comment:", err);
    }
  };

  const handleUpdateComment = async (idComment) => {
    try {
      await axios.put(
        `https://jiranew.cybersoft.edu.vn/api/Comment/updateComment?idComment=${idComment}&contentComment=${editContent}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        }
      );
      setEditingComment(null);
      setEditContent("");
      refreshComments();
    } catch (err) {
      console.error("Lỗi cập nhật comment:", err);
    }
  };

  const handleDeleteComment = async (idComment) => {
    if (!window.confirm("Bạn có chắc muốn xoá comment này?")) return;
    try {
      await axios.delete(
        `https://jiranew.cybersoft.edu.vn/api/Comment/deleteComment?idComment=${idComment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        }
      );
      setComments((prev) => prev.filter((c) => c.id !== idComment));
    } catch (err) {
      console.error("Lỗi xoá comment:", err);
    }
  };

  if (!task)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
        Đang tải thông tin task...
      </div>
    );

  return (
   
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-5xl flex overflow-hidden relative">
        {/* Nút đóng */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>

        
        <div className="w-2/3 p-8 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center gap-3 mb-5">
            <select className="border px-2 py-1 rounded text-sm">
              <option>{task.typeTask?.taskType}</option>
            </select>
            <h2 className="text-lg font-semibold">{task.taskName}</h2>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            This is an issue of type: <b>Task</b>
          </p>

          {/* Description */}
          <div className="mb-6">
            <h4 className="font-semibold mb-1 text-sm">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Comment Section */}
          <div>
            <h4 className="font-semibold mb-2 text-sm">Comment</h4>

            {/* Add comment box */}
            <div className="flex items-start gap-2 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/147/147142.png"
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add a comment ..."
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
                  rows="2"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Protip: press <b>M</b> to comment
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={handleAddComment}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setContent("")}
                    className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <img
                    src={c.user.avatar}
                    alt={c.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{c.user.name}</p>
                    {editingComment === c.id ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring"
                          rows="2"
                        ></textarea>
                        <div className="mt-1 space-x-2">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                            onClick={() => handleUpdateComment(c.id)}
                          >
                            Update
                          </button>
                          <button
                            className="bg-gray-300 px-3 py-1 rounded text-sm"
                            onClick={() => setEditingComment(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-800">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: c.contentComment,
                          }}
                        ></div>
                        <div className="text-xs mt-1 text-blue-600 space-x-2">
                          <button
                            onClick={() => {
                              setEditingComment(c.id);
                              setEditContent(c.contentComment);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="w-1/3 border-l p-6 text-sm text-gray-700 overflow-y-auto max-h-[85vh]">
          <div className="mb-4">
            <label className="block font-semibold mb-1">STATUS</label>
            <input
              className="w-full border rounded px-2 py-1 bg-gray-100"
              value={task.statusTask?.statusName || "IN PROGRESS"}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">ASSIGNEES</label>
            <div className="flex flex-wrap gap-2">
              {task.assigness?.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-200 rounded-full px-2 py-1 text-xs"
                >
                  {user.name}
                </div>
              ))}
              <button className="text-blue-500 text-xs">+ Add more</button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">PRIORITY</label>
            <input
              className="w-full border rounded px-2 py-1 bg-gray-100"
              value={task.priorityTask?.priority || ""}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">
              ORIGINAL ESTIMATE (HOURS)
            </label>
            <input
              className="w-full border rounded px-2 py-1"
              value={task.originalEstimate}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">TIME TRACKING</label>
            <div className="flex items-center gap-3">
              <span>{task.timeTrackingSpent}h logged</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${
                      (task.timeTrackingSpent /
                        (task.timeTrackingSpent +
                          task.timeTrackingRemaining)) *
                        100 || 0
                    }%`,
                  }}
                ></div>
              </div>
              <span>{task.timeTrackingRemaining}h remaining</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 border-t pt-2">
            <p>Created a month ago</p>
            <p>Updated a few seconds ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEdit;