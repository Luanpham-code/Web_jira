import React, { useEffect, useState } from "react";
import axios from "axios";

const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // 🔹 thay token thật
const API_URL = "https://jiranew.cybersoft.edu.vn/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    passWord: "",
  });
  const [editing, setEditing] = useState(null);

  // ✅ Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("accessToken");

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/Users/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
          TokenCybersoft: TOKEN_CYBERSOFT,
        },
      });
      setUsers(res.data.content);
    } catch (err) {
      console.error("Lỗi tải danh sách user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== HANDLE CREATE / UPDATE =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/Users/editUser`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        });
        alert("Cập nhật user thành công!");
      } else {
        await axios.post(`${API_URL}/Users/signup`, form, {
          headers: { TokenCybersoft: TOKEN_CYBERSOFT },
        });
        alert("Thêm user thành công!");
      }
      setForm({ email: "", name: "", phoneNumber: "", passWord: "" });
      setEditing(null);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi lưu user:", err);
    }
  };

  // ===== DELETE USER =====
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      await axios.delete(`${API_URL}/Users/deleteUser?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          TokenCybersoft: TOKEN_CYBERSOFT,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi xóa user:", err);
    }
  };

  // ===== FILTER + PAGINATION =====
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ===== CHUYỂN TRANG =====
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-8">
      {/* Tiêu đề */}
      <h1 className="text-blue-600 text-xl font-semibold mb-4 underline cursor-pointer">
        Create user
      </h1>

      {/* Ô search */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="search ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
          }}
          className="border border-gray-400 px-3 py-2 rounded w-full max-w-3xl"
        />
        <button className="border border-gray-400 bg-white px-4 py-2 rounded hover:bg-gray-100">
          Search
        </button>
      </div>

      {/* Bảng danh sách */}
      <table className="w-full border border-gray-400 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 p-2 w-12 text-center">STT</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((u, i) => (
              <tr key={u.userId} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">
                  {startIndex + i + 1}
                </td>
                <td className="border border-gray-300 p-2">{u.email}</td>
                <td className="border border-gray-300 p-2">{u.name}</td>
                <td className="border border-gray-300 p-2">{u.phoneNumber}</td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  <button
                    onClick={() => {
                      setEditing(u);
                      setForm({
                        email: u.email,
                        name: u.name,
                        phoneNumber: u.phoneNumber,
                        passWord: "",
                      });
                    }}
                    className="border border-gray-400 px-3 py-1 rounded hover:bg-yellow-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.userId)}
                    className="border border-gray-400 px-3 py-1 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center p-4 text-gray-500 border border-gray-300"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 PHÂN TRANG THẬT */}
      {totalPages > 1 && (
  <div className="flex justify-end items-center gap-2 mt-4 text-sm text-gray-700">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="hover:underline disabled:text-gray-400"
    >
      ← prev
    </button>

    {(() => {
      const pageButtons = [];
      const maxButtons = 10;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxButtons / 2)
      );
      let endPage = startPage + maxButtons - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-2 py-1 rounded ${
              currentPage === i
                ? "border border-gray-400 font-semibold"
                : "hover:underline"
            }`}
          >
            {i}
          </button>
        );
      }
      return pageButtons;
    })()}

    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="hover:underline disabled:text-gray-400"
    >
      next →
    </button>
  </div>
)}

      {/* Form thêm/sửa user */}
      <div className="mt-10 border border-gray-400 p-4 rounded w-full max-w-lg">
        <h3 className="font-semibold mb-3">
          {editing ? "Edit User" : "Create New User"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-gray-400 w-full px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-400 w-full px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Phone number"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="border border-gray-400 w-full px-3 py-2 rounded"
            required
          />
          {!editing && (
            <input
              type="password"
              placeholder="Password"
              value={form.passWord}
              onChange={(e) => setForm({ ...form, passWord: e.target.value })}
              className="border border-gray-400 w-full px-3 py-2 rounded"
              required
            />
          )}
          <button
            type="submit"
            className="border border-gray-400 bg-white px-4 py-2 rounded hover:bg-gray-100"
          >
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;