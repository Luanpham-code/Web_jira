import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, message } from "antd";
import { projectService } from "../../service/projectService";
import axios from "axios";


const { Option } = Select;

const CreateTaskPage = () => {
  const [projects, setProjects] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("🔍 Bắt đầu gọi API..."); // ✅ kiểm tra xem có chạy vào đây không

      const [projectRes, statusRes, priorityRes, typeRes, userRes] =
        await Promise.all([
          axios.get("/Project/getAllProject"),
          axios.get("/Status/getAll"),
          axios.get("/Priority/getAll?id=0"),
          axios.get("/TaskType/getAll"),
          axios.get("/Users/getUser"),
        ]);

      console.log({
        projectRes: projectRes.data,
        statusRes: statusRes.data,
        priorityRes: priorityRes.data,
        typeRes: typeRes.data,
        userRes: userRes.data,
      });

      setProjects(projectRes.data.content || []);
      setStatusList(statusRes.data.content || []);
      setPriorityList(priorityRes.data.content || []);
      setTaskTypes(typeRes.data.content || []);
      setUsers(userRes.data.content || []);
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      message.error("Không thể tải dữ liệu.");
    }
  };

    fetchData();
    }, []);
                     
  // ✅ Submit tạo task
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        listUserAsign: values.listUserAsign,
        taskName: values.taskName,
        description: values.description,
        statusId: values.statusId,
        originalEstimate: values.originalEstimate,
        timeTrackingSpent: values.timeTrackingSpent || 0,
        timeTrackingRemaining: values.timeTrackingRemaining || 0,
        projectId: values.projectId,
        typeId: values.typeId,
        priorityId: values.priorityId,
      };

      await axios.post("/api/Project/createTask", payload);

      message.success("Tạo task thành công!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Tạo task thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create Task</h2>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* (1) Project */}
        <Form.Item
          label="Project"
          name="projectId"
          rules={[{ required: true, message: "Vui lòng chọn project" }]}
        >
          <Select
            showSearch
            placeholder="Select project"
            optionFilterProp="children"
          >
            {Array.isArray(projects) && projects.map((p) => (
            <Option key={p.id} value={p.id}>
            {p.projectName}
            </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Task name */}
        <Form.Item
          label="Task name"
          name="taskName"
          rules={[{ required: true, message: "Vui lòng nhập tên task" }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          {/* (2) Status */}
          <Form.Item
            label="Status"
            name="statusId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select status">
              {Array.isArray(statusList) && statusList.map((s) => (
              <Option key={s.statusId} value={s.statusId}>
              {s.statusName}
              </Option>
            ))}
            </Select>
          </Form.Item>

          {/* (3) Priority */}
          <Form.Item
            label="Priority"
            name="priorityId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select priority">
              {Array.isArray(priorityList) && priorityList.map((p) => (
              <Option key={p.priorityId} value={p.priorityId}>
              {p.priority}
               </Option>
              ))}
            </Select>
          </Form.Item>

          {/* (4) Task type */}
          <Form.Item
            label="Task type"
            name="typeId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select task type">
              {Array.isArray(taskTypes) && taskTypes.map((t) => (
              <Option key={t.id} value={t.id}>
              {t.taskType}
              </Option>
              ))}
            </Select>
          </Form.Item>

          {/* (5) Assignees */}
          <Form.Item
            label="Assignees"
            name="listUserAsign"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Select users"
              optionFilterProp="children"
            >
              {/* {users.map((u) => (
                <Option key={u.userId} value={u.userId}>
                  {u.name}
                </Option>
              ))} */}
              {Array.isArray(users) && users.map((u) => (
              <Option key={u.userId} value={u.userId}>
              {u.name}
              </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Estimate & Time tracking */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Original Estimate" name="originalEstimate">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Time Spent" name="timeTrackingSpent">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Time Remaining" name="timeTrackingRemaining">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Enter task description..." />
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-600"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTaskPage;
