import React, { useEffect, useState } from "react";
import axios from "axios";

const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // ✅ Thay token thật
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

  // ===== HANDLE CREATE OR UPDATE =====
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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search + Create button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm w-1/3"
        />
        <button
          onClick={() => {
            setEditing(null);
            setForm({ email: "", name: "", phoneNumber: "", passWord: "" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create User
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, i) => (
            <tr key={u.userId} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{i + 1}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.phoneNumber}</td>
              <td className="border p-2 text-center space-x-2">
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
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.userId)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form thêm/sửa user */}
      <div className="mt-6 bg-gray-50 border rounded-lg p-4 max-w-md">
        <h3 className="font-semibold mb-3">
          {editing ? "Edit User" : "Create New User"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border w-full px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border w-full px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Phone number"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value })
            }
            className="border w-full px-3 py-2 rounded"
            required
          />
          {!editing && (
            <input
              type="password"
              placeholder="Password"
              value={form.passWord}
              onChange={(e) => setForm({ ...form, passWord: e.target.value })}
              className="border w-full px-3 py-2 rounded"
              required
            />
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;