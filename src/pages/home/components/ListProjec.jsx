import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListProjecAction } from "../../../stores/Project";
import { projectService } from "../../../service/projectService";
import {Table,Space,Button,Avatar,Tooltip,Popconfirm,message,} from "antd";
import axios from "axios";

const ListProjec = () => {
  const dispatch = useDispatch();
  const listProjec = useSelector((state) => state.projectSlice.listProjec);

  // state quản lý filter, sorter & pagination
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
  });

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
    await axios.delete(`https://685165ba8612b47a2c09e3e5.mockapi.io/projects/${id}`);
    alert("Xóa thành công!");
    // Cập nhật lại danh sách sau khi xóa
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    alert("Xóa thất bại!");
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
      render: (members) => (
        <Avatar.Group
          max={{
            count: 3,
            style: { color: "#f56a00", backgroundColor: "#fde3cf" },
          }}
        >
          {members.map((m) => (
            <Tooltip key={m.userId} title={m.name}>
              <Avatar style={{ backgroundColor: "#87d068" }}>
                {m.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary">Edit</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="hủy"
          >
            <Button danger onClick={() => handleDelete(project.id)}>
             Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
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
    </>
  );
};

export default ListProjec;
