import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListProjecAction } from "../../../stores/Project";
import { projectService } from "../../../service/projectService";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
} from "antd";
import EditProjectModal from "./EditProjectModal";
import MemberCell from "./MemberCell"; // ✅ import component mới
import { useNavigate } from "react-router-dom";

const ListProjec = () => {
  const dispatch = useDispatch();
  const listProjec = useSelector((state) => state.projectSlice.listProjec);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
  });

  // ✅ Mở modal chỉnh sửa
  const openEditModal = (id) => {
    setEditingProjectId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // ✅ Gọi API load danh sách project
  const fetchListProjec = async () => {
    try {
      const response = await projectService.getListProject();
      const dataWithAge = response.data.content.map((p) => ({
        ...p,
        age: Math.floor(Math.random() * 40) + 20,
      }));
      dispatch(setListProjecAction(dataWithAge));
    } catch (error) {
      console.error("error:", error);
    }
  };

  // ✅ Xóa project
  const handleDelete = async (id) => {
    try {
      await projectService.deleteProject(id);
      message.success("✅ Xóa thành công!");
      fetchListProjec();
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      message.error("Xóa thất bại, thử lại sau!");
    }
  };

  // ✅ Xóa user khỏi project
  const handleRemoveUser = async (projectId, userId) => {
    try {
      await projectService.removeUserFromProject(projectId, userId);
      message.success("✅ Đã xóa thành viên khỏi project!");
      fetchListProjec();
    } catch (error) {
      console.error("❌ Lỗi khi xóa thành viên:", error);
      message.error("Lỗi khi xóa thành viên!");
    }
  };

  // ✅ Thêm user vào project (gọi API)
  const handleAddMember = async (projectId, username) => {
    try {
      await projectService.addUserToProject({
        projectId,
        userName: username,
      });
      message.success("✅ Đã thêm thành viên!");
      fetchListProjec();
    } catch (error) {
      console.error("❌ Lỗi khi thêm:", error);
      message.error("Không thể thêm thành viên!");
    }
  };

  useEffect(() => {
    fetchListProjec();
  }, []);

  const handleChange = (newPagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPagination(newPagination);
  };

  const clearFilters = () => setFilteredInfo({});
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const setAgeSort = () =>
    setSortedInfo({ order: "descend", columnKey: "age" });

  // ✅ Cấu hình các cột của bảng
  const navigate = useNavigate();
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (text, record) => (
        <a
      onClick={() => navigate(`/projectdetail/${record.id}`)}
      className="font-medium text-gray-800 hover:text-indigo-600 cursor-pointer"
    >
      {text}
    </a>
      ),
    },
    { title: "Category", dataIndex: "categoryName", key: "categoryName" },
    { title: "Creator", dataIndex: ["creator", "name"], key: "creator" },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (members, record) => (
        <MemberCell
          members={members}
          record={record}
          onAddMember={handleAddMember}
          onRemoveUser={handleRemoveUser}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            className="!bg-indigo-500 hover:!bg-indigo-600 transition"
            onClick={() => openEditModal(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button className="!bg-red-500 hover:!bg-red-600 !border-none !text-white">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-indigo-600">
          📋 Danh sách dự án
        </h2>
        <div className="space-x-2">
          <Button onClick={setAgeSort}>Sort Age</Button>
          <Button onClick={clearFilters}>Clear Filters</Button>
          <Button onClick={clearAll}>Clear All</Button>
        </div>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={listProjec}
        onChange={handleChange}
        pagination={pagination}
      />

      <EditProjectModal
        visible={isEditModalOpen}
        projectId={editingProjectId}
        onCancel={closeEditModal}
        onSuccess={fetchListProjec}
      />
    </div>
  );
};

export default ListProjec;
