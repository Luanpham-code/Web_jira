import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, message } from "antd";
import { projectService } from "../../service/projectService";
import { Slider } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
        const [projectRes, statusRes, priorityRes, typeRes, userRes] =
          await Promise.all([
            projectService.getListProject(),
            projectService.getAllStatus(),
            projectService.getAllPriority(),
            projectService.getAllTaskType(),
            projectService.getAllUsers(),
          ]);

        const uniqueUsers = (userRes.data.content || []).filter(
          (v, i, a) => a.findIndex((t) => t.userId === v.userId) === i
        );

        setProjects(projectRes.data.content || []);
        setStatusList(statusRes.data.content || []);
        setPriorityList(priorityRes.data.content || []);
        setTaskTypes(typeRes.data.content || []);
        setUsers(uniqueUsers);
      } catch (error) {
        console.error(" Lỗi khi gọi API:", error);
        message.error("Không thể tải dữ liệu.");
      }
    };

    fetchData();
  }, []);

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

      await projectService.createTask(payload);

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
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-6">Create Task</h2>

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
            {projects.map((p) => (
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

        {/* Status */}
        <Form.Item
          label="Status"
          name="statusId"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select status">
            {statusList.map((s) => (
              <Option key={s.statusId} value={s.statusId}>
                {s.statusName}
              </Option>
            ))}
          </Select>
        </Form.Item>

      
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Priority"
            name="priorityId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select priority">
              {priorityList.map((p) => (
                <Option key={p.priorityId} value={p.priorityId}>
                  {p.priority}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Task type"
            name="typeId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select task type">
              {taskTypes.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.taskType}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        
        <div className="grid grid-cols-2 gap-4">
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
          {users.map((u) => (
          <Option key={u.userId} value={u.userId}>
          {u.name}
          </Option>
          ))}
          </Select>
        </Form.Item>

        
     <div>
    <label className="font-medium block mb-2">Time tracking</label>

    
    <Slider
       min={0}
       max={
        (form.getFieldValue("timeTrackingSpent") || 0) +
        (form.getFieldValue("timeTrackingRemaining") || 0)
       }
      value={form.getFieldValue("timeTrackingSpent") || 0}
      tooltip={{ open: false }}
      />

      <div className="flex justify-between text-gray-500 text-sm">
       <span>
         {(form.getFieldValue("timeTrackingSpent") || 0) + "h logged"}
       </span>
       <span>
        {(form.getFieldValue("timeTrackingRemaining") || 0) +
          "h remaining"}
       </span>
       </div>
      </div>
    </div>

        
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
         <ReactQuill
           theme="snow"
           placeholder="Enter task description..."
           style={{ height: 200 }}
         />
        </Form.Item>

        {/* Submit */}
        <Form.Item style={{ marginTop: 24 }}>
        <div className="flex justify-end space-x-2 ">
          <Button>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-600"
          >
            Submit
          </Button>
        </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTaskPage;
