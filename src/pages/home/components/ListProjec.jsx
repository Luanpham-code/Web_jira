import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListProjecAction } from "../../../stores/Project";
import { projectService } from "../../../service/projectService";
import { Table, Space, Button, Avatar, Tooltip, Popconfirm, message, Popover } from "antd";
import axios from "axios";
import EditProjectModal from "./EditProjectModal";

const ListProjec = () => {
  const dispatch = useDispatch();
  const listProjec = useSelector((state) => state.projectSlice.listProjec);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 

  // state quản lý filter, sorter & pagination
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
  });
  const openEditModal = (id) => {
    setEditingProjectId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // gọi API
  const fetchListProjec = async () => {
    try {
      const response = await projectService.getListProject();

      // 👉 thêm age random để test sort
      const dataWithAge = response.data.content.map((p) => ({
        ...p,
        age: Math.floor(Math.random() * 40) + 20, // 20-60 tuổi
      }));

      console.log("API DATA + AGE:", dataWithAge);
      dispatch(setListProjecAction(dataWithAge));
    } catch (error) {
      console.error("error:", error);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await projectService.deleteProject(id);
  //     message.success("Xoá thành công");
  //     fetchListProjec();
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Xoá thất bại: " + (err.response?.data?.message || ""));
  //   }
  // };

  const handleDelete = async (id) => {
  try {
    // Kiểm tra token trước khi gọi API
    const userToken = localStorage.getItem("accessToken"); // Token đăng nhập lưu khi login
    const cybersoftToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8"; // TokenCybersoft (copy đúng bản của bạn)

    if (!userToken) {
      console.error("Không có token đăng nhập, vui lòng đăng nhập lại!");
      return;
    }

    console.log("Gửi yêu cầu xoá project ID:", id);

    const response = await axios.delete(
      `https://jiranew.cybersoft.edu.vn/api/Project/deleteProject?projectId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          TokenCybersoft: cybersoftToken,
        },
      }
    );

    console.log("Xóa thành công:", response.data);

    // Nếu bạn có danh sách project đang load lại từ API thì gọi lại ở đây
    // ví dụ:
    // dispatch(setListProjecAction());

  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    if (error.response) {
      console.log("Chi tiết lỗi:", error.response.status, error.response.data);
    }
  }
};

const handleRemoveUser = async (projectId, userId) => {
  try {
    const userToken = localStorage.getItem("accessToken");
    const cybersoftToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjExLzAyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";

    const body = {
      projectId,
      userId,
    };

    await axios.delete(
      "https://jiranew.cybersoft.edu.vn/api/Project/removeUserFromProject",
      {
        data: body, // DELETE cần truyền qua `data`
        headers: {
          Authorization: `Bearer ${userToken}`,
          TokenCybersoft: cybersoftToken,
        },
      }
    );

    message.success("Đã xóa thành viên khỏi dự án");
    fetchListProjec(); // reload lại danh sách
  } catch (error) {
    console.error("Lỗi khi xóa thành viên:", error);
    message.error("Không thể xóa thành viên");
  }
};


  useEffect(() => {
    fetchListProjec();
  }, []);

  // sự kiện khi table change (filter, sort, pagination)
  const handleChange = (newPagination, filters, sorter) => {
    console.log("Pagination:", newPagination);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPagination(newPagination); // update lại pagination khi đổi trang hoặc pageSize
  };

  // clear filter & sorter
  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setAgeSort = () => {
    setSortedInfo({
      order: "descend", // hoặc "ascend"
      columnKey: "age",
    });
  };

  // columns
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
      render: (text) => <a>{text}</a>,
      filters: [
        { text: "Web", value: "web" },
        { text: "App", value: "app" },
      ],
      filteredValue: filteredInfo.projectName || null,
      onFilter: (value, record) =>
        record.projectName.toLowerCase().includes(value.toLowerCase()),
    },
    { title: "Category", dataIndex: "categoryName", key: "categoryName" },
    { title: "Creator", dataIndex: ["creator", "name"], key: "creator" },

    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
    },

     
       {
  title: "Members",
  dataIndex: "members",
  key: "members",
  render: (members, record) => {
    const memberList = (
      <div className="w-64">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">ID</th>
              <th className="text-left py-1">Avatar</th>
              <th className="text-left py-1">Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.userId} className="border-b hover:bg-gray-50">
                <td className="py-1">{m.userId}</td>
                <td className="py-1">
                  <Avatar
                    size="small"
                    src={m.avatar}
                    className="border border-gray-300"
                  >
                    {m.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </td>
                <td className="py-1">{m.name}</td>
                <td className="py-1">
                  <Button
                    danger
                    shape="circle"
                    size="small"
                    className="!bg-red-500 hover:!bg-red-600 !border-none !text-white"
                    onClick={() => handleRemoveUser(record.id, m.userId)}
                  >
                    ✕
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="inline-block overflow-visible">
        <Popover
          content={memberList}
          title="Members"
          trigger="hover"
          placement="right"
        >
          <Avatar.Group
            max={{
              count: 3,
              style: { color: "#f56a00", backgroundColor: "#fde3cf" },
            }}
          >
            {members.map((m) => (
              <Tooltip key={m.userId} title={m.name}>
                <Avatar
                  src={m.avatar}
                  className="border border-gray-300 shadow-sm"
                >
                  {m.name
                    ?.split(" ")
                    ?.map((w) => w[0])
                    ?.join("")
                    ?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </Popover>
      </div>
    );
  },
},
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openEditModal(record.id)}>
            Edit
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setAgeSort}>Sort age</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={listProjec}
        onChange={handleChange}
        pagination={pagination} // ✅ dùng pagination state
      />
      <EditProjectModal
        visible={isEditModalOpen}
        projectId={editingProjectId}
        onCancel={closeEditModal}
        onSuccess={fetchListProjec} // reload lại danh sách
      />
      </div>
    </>
  );
};

export default ListProjec;
