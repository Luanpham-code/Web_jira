import React, { useEffect, useState } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";





const CreateProject = () => {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Lấy danh mục project
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        const TOKEN_CYBERSOFT =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTMiLCJIZXRIYW5TdHJpbmciOiIxMi8wNi8yMDI2IiwiSGV0SGFuVGltZSI6IjE3ODEyMjI0MDAwMDAiLCJuYmYiOjE3NjI4ODQwMDAsImV4cCI6MTc4MTM3MzYwMH0.ZxhiMsctm3eKMVBpn81V6ioC1EwaG05VEeMMv-ReXVA";

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
        console.error(" Lỗi khi tải danh mục:", error);
        alert("Không thể tải danh mục dự án!");
      }
    };

    fetchCategories();
  }, []);

  // Cập nhật giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  //  Cập nhật nội dung Editor
  // const handleEditorChange = (content) => {
  //   setForm({ ...form, description: content });
  // };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const TOKEN_CYBERSOFT =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTMiLCJIZXRIYW5TdHJpbmciOiIxMi8wNi8yMDI2IiwiSGV0SGFuVGltZSI6IjE3ODEyMjI0MDAwMDAiLCJuYmYiOjE3NjI4ODQwMDAsImV4cCI6MTc4MTM3MzYwMH0.ZxhiMsctm3eKMVBpn81V6ioC1EwaG05VEeMMv-ReXVA";

      // Kiểm tra trùng tên
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
        alert(" Tên dự án đã tồn tại!");
        setLoading(false);
        return;
      }

      // Gửi yêu cầu tạo mới
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

      console.log(" Response:", response.data);
      alert(" Tạo dự án thành công!");
      window.location.href = "/projectmanagement";
    } catch (error) {
      console.error(" Lỗi khi tạo dự án:", error);
      alert(" Tạo dự án thất bại! Kiểm tra token hoặc dữ liệu gửi lên.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-4">Create Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        {/*  Nhập tên dự án */}
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

        {/* /*  Trình soạn thảo mô tả (TinyMCE) */ }
        {/* <div>
          <label className="block mb-1 font-semibold">Description</label>
          <Editor
           apiKey="zkgjkolyr6e2afh7agqajzk8o625esd8xyixcj4k11enkjaa" 
           init={{
           height: 400,
           menubar: true,
           plugins: [
           "advlist autolink lists link image charmap preview anchor",
           "searchreplace visualblocks code fullscreen",
           "insertdatetime media table help wordcount"
           ],
          toolbar:
           "undo redo | blocks | bold italic underline | " +
           "alignleft aligncenter alignright alignjustify | " +
           "bullist numlist outdent indent | removeformat | help",
          content_style:
           "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          value={form.description}
          onEditorChange={(content) => setForm({ ...form, description: content })}
        />
        </div> */}

        <div>
            <label className="block mb-1 font-semibold">Description</label>
              <ReactQuill
               theme="snow"
               value={form.description}
               onChange={(content) => setForm({ ...form, description: content })}
               placeholder="Enter task description..."
               style={{ height: 200 }}
               />
        </div>

        {/*  Danh mục */}
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

        {/*  Nút Submit */}
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
