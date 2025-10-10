import React, { useEffect, useState } from "react";
import axios from "axios";
 
const CreateProject = () => {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    categoryId: "",
  });
 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
 
  // 🔹 Lấy danh sách Category khi load trang
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const TOKEN_CYBERSOFT =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";
 
        const res = await axios.get(
          "https://jiranew.cybersoft.edu.vn/api/ProjectCategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              TokenCybersoft: TOKEN_CYBERSOFT,
            },
          }
        );
        setCategories(res.data.content);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh mục:", error);
        alert("Không thể tải danh mục dự án!");
      }
    };
 
    fetchCategories();
  }, []);
 
  // 🔹 Cập nhật giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
 
  // 🔹 Submit form tạo Project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("AccessToken:", localStorage.getItem("accessToken"));
    try {
      const token = localStorage.getItem("accessToken");
      const TOKEN_CYBERSOFT =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";
 
      // 1️⃣ Lấy danh sách project để kiểm tra trùng tên
      const allProjects = await axios.get(
        "https://jiranew.cybersoft.edu.vn/api/Project/getAllProject",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        }
      );
 
      const exists = allProjects.data.content.some(
        (p) =>
          p.projectName.toLowerCase().trim() ===
          form.projectName.toLowerCase().trim()
      );
 
      if (exists) {
        alert("⚠️ Tên dự án đã tồn tại, vui lòng chọn tên khác!");
        setLoading(false);
        return;
      }
 
      // 2️⃣ Gửi yêu cầu tạo project mới
      const response = await axios.post(
        "https://jiranew.cybersoft.edu.vn/api/Project/createProjectAuthorize",
        {
          projectName: form.projectName.trim(),
          description: form.description.trim(),
          categoryId: Number(form.categoryId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        }
      );
 
      console.log("✅ Response:", response.data);
      alert("🎉 Tạo dự án thành công!");
      window.location.href = "/projectmanagement"; // chuyển hướng
    } catch (error) {
      console.error("❌ Lỗi khi tạo dự án:", error);
      if (
        error.response?.data?.content?.includes("Project name already exists")
      ) {
        alert("⚠️ Tên dự án đã tồn tại, vui lòng nhập tên khác!");
      } else {
        alert("❌ Tạo dự án thất bại! Kiểm tra token hoặc dữ liệu gửi lên.");
      }
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-4">Create Project</h2>
 
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {/* Nhập tên dự án */}
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            placeholder="Nhập tên dự án"
            className="border rounded w-full p-2"
            required
          />
        </div>
 
        {/* Mô tả */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Nhập mô tả dự án"
            className="border rounded w-full p-2 h-32"
            required
          />
        </div>
 
        {/* Danh mục */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.projectCategoryName}
              </option>
            ))}
          </select>
        </div>
 
        {/* Nút Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded transition`}
        >
          {loading ? "Đang tạo..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};
 
export default CreateProject;