import React, { useState } from "react";
import {
  Avatar,
  Tooltip,
  Popover,
  AutoComplete,
  Button,
  Table,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { projectService } from "../../../service/projectService";

const MemberCell = ({ members, record, onAddMember, onRemoveUser }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  //  Khi người dùng gõ → gọi API getUserByKeyword
  const handleSearch = async (value) => {
    setSearchValue(value);
    if (!value.trim()) {
      setOptions([]);
      return;
    }

    try {
      const res = await projectService.getUserByKeyword(value);
      const users = res.data.content.map((user) => ({
        value: user.name,
        label: (
          <div className="flex items-center gap-2">
            <Avatar src={user.avatar} size={24} />
            <span>{user.name}</span>
          </div>
        ),
      }));
      setOptions(users);
    } catch (error) {
      console.error(" Lỗi tìm user:", error);
      setOptions([]);
    }
  };

  //  Giao diện popover thêm thành viên
  const addMemberContent = (
    <div className="p-2 w-56">
      <AutoComplete
        placeholder="Nhập tên người dùng..."
        options={options}
        value={searchValue}
        onSearch={handleSearch}
        onSelect={(value) => setSearchValue(value)}
        style={{ width: "100%" }}
      />
      <Button
        type="primary"
        className="mt-2 w-full"
        onClick={() => {
          if (!searchValue.trim()) {
            message.warning("Vui lòng nhập tên người dùng!");
            return;
          }
          onAddMember(record.id, searchValue);
          setSearchValue("");
          setOptions([]);
          setIsPopoverVisible(false);
        }}
      >
        Thêm
      </Button>
    </div>
  );

  //  Popover danh sách member
  const memberTable = (
    <div className="w-72">
      <Table
        size="small"
        pagination={false}
        rowKey="userId"
        columns={[
          { title: "Id", dataIndex: "userId", width: 60 },
          {
            title: "Avatar",
            dataIndex: "avatar",
            width: 60,
            render: (src) => <Avatar src={src} />,
          },
          { title: "Name", dataIndex: "name" },
          {
            title: "",
            dataIndex: "userId",
            width: 40,
            render: (userId) => (
              <Popconfirm
                title="Xóa thành viên này?"
                onConfirm={() => onRemoveUser(record.id, userId)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button
                  size="small"
                  shape="circle"
                  danger
                  icon={<CloseOutlined />}
                />
              </Popconfirm>
            ),
          },
        ]}
        dataSource={members}
      />
    </div>
  );

  return (
    <div className="flex items-center space-x-2">
      {/* Hover để xem danh sách thành viên */}
      <Popover
        placement="rightTop"
        title="Members"
        content={memberTable}
        trigger="hover"
      >
        <div className="flex items-center space-x-1 cursor-pointer">
          {members?.slice(0, 3).map((m) => (
            <Tooltip key={m.userId} title={m.name}>
              <Avatar
                src={m.avatar}
                className="hover:scale-110 transition-transform duration-150 border border-gray-300"
              />
            </Tooltip>
          ))}
          {members?.length > 3 && (
            <Avatar className="bg-gray-200 text-gray-600">{`+${members.length - 3}`}</Avatar>
          )}
        </div>
      </Popover>

      {/* Nút thêm thành viên */}
      <Popover
        content={addMemberContent}
        title="Thêm thành viên"
        trigger="click"
        open={isPopoverVisible}
        onOpenChange={setIsPopoverVisible}
      >
        <Button
          type="dashed"
          shape="circle"
          icon={<PlusOutlined />}
          className="hover:!bg-indigo-100 hover:!border-indigo-400 transition"
        />
      </Popover>
    </div>
  );
};

export default MemberCell;
