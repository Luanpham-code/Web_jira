import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, message, Slider } from "antd";
import { projectService } from "../../service/projectService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Option } = Select;

const CreateTaskPage = () => {
  const [existingTaskNames, setExistingTaskNames] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 🧭 Lấy dữ liệu khi load trang
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
        console.error("❌ Lỗi khi gọi API:", error);
        message.error("Không thể tải dữ liệu.");
      }
    };

    fetchData();
  }, []);

  // ✅ Theo dõi giá trị realtime trong form
  const spent = Form.useWatch("timeTrackingSpent", form) || 0;
  const remaining = Form.useWatch("timeTrackingRemaining", form) || 0;

  // inside CreateTaskPage component
const handleSubmit = async (values) => {
  setLoading(true);
  try {
    // normalize
    const payload = {
      listUserAsign: (values.listUserAsign || []).map((id) => Number(id)),
       taskName: values.taskName?.trim().toLowerCase(),
      description: values.description || "Không có mô tả",
      statusId: Number(values.statusId),
      originalEstimate: Number(values.originalEstimate) || 0,
      timeTrackingSpent: Number(values.timeTrackingSpent) || 0,
      timeTrackingRemaining: Number(values.timeTrackingRemaining) || 0,
      projectId: Number(values.projectId),
      typeId: Number(values.typeId),
      priorityId: Number(values.priorityId),
    };

    console.log("🚀 Payload gửi lên backend:", payload);

    // client-side required check
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        message.error(`Thiếu dữ liệu ở trường: ${key}`);
        setLoading(false);
        return;
      }
    }

    // --- NEW: kiểm tra trùng tên task trước khi gửi ---
    // --- Kiểm tra trùng tên task trong project ---
try {
  const projectDetailRes = await projectService.getProjectDetail(payload.projectId);
  const content = projectDetailRes?.data?.content;

  // Lấy toàn bộ danh sách taskName từ tất cả các cột (BACKLOG, IN PROGRESS, DONE,...)
  const allTasks = (content?.lstTask || []).flatMap(
    (group) => group.lstTaskDeTail || []
  );

  const existingNames = allTasks.map((t) => t.taskName?.trim().toLowerCase());
if (existingNames.includes(payload.taskName)) {
  message.error("⚠️ Task này đã tồn tại trong project. Vui lòng chọn tên khác!");
  setLoading(false);
  return;
}
} catch (errCheck) {
  console.warn("⚠️ Không kiểm tra được trùng tên task:", errCheck);
}


    // gửi tạo task
    const res = await projectService.createTask(payload);
    console.log("✅ Server phản hồi:", res);
    message.success("Tạo task thành công!");
    form.resetFields();
  } catch (err) {
  const serverData = err.response?.data;
  console.error("❌ Chi tiết lỗi:", serverData || err);

  if (serverData?.content?.includes("exists")) {
    message.error("⚠️ Task đã tồn tại trong hệ thống. Vui lòng đổi tên khác!");
  } else if (serverData?.content && typeof serverData.content === "string") {
    message.error(serverData.content);
  } else if (serverData?.message) {
    message.error(serverData.message);
  } else {
    message.error("Tạo task thất bại! Kiểm tra console để biết thêm chi tiết.");
  }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-6">Create Task</h2>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Project */}
        <Form.Item
  label="Project"
  name="projectId"
  rules={[{ required: true, message: "Vui lòng chọn project" }]}
>
  <Select
    showSearch
    placeholder="Select project"
    optionFilterProp="children"
    onChange={async (projectId) => {
      try {
        const res = await projectService.getProjectDetail(projectId);
        const content = res?.data?.content;
        const allTasks = (content?.lstTask || []).flatMap(
          (group) => group.lstTaskDeTail || []
        );
        const names = allTasks.map((t) => t.taskName?.trim().toLowerCase());
        setExistingTaskNames(names); // cập nhật vào state
        console.log("✅ existingTaskNames:", names);
      } catch (err) {
        console.warn("Không tải được danh sách task:", err);
        setExistingTaskNames([]); // reset nếu lỗi
      }
    }}
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
  rules={[
    { required: true, message: "Vui lòng nhập tên task" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value) return Promise.resolve();
        const name = value.trim().toLowerCase();
        if (existingTaskNames.includes(name)) {
          return Promise.reject(new Error("⚠️ Task này đã tồn tại trong project!"));
        }
        return Promise.resolve();
      },
    }),
  ]}
>
  <Input placeholder="Enter task name" />
</Form.Item>



        {/* Status */}
        <Form.Item label="Status" name="statusId" rules={[{ required: true }]}>
          <Select placeholder="Select status">
            {statusList.map((s) => (
              <Option key={s.statusId} value={s.statusId}>
                {s.statusName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Priority" name="priorityId" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              {priorityList.map((p) => (
                <Option key={p.priorityId} value={p.priorityId}>
                  {p.priority}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Task type" name="typeId" rules={[{ required: true }]}>
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
          <Form.Item label="Assignees" name="listUserAsign" rules={[{ required: true }]}>
            <Select mode="multiple" showSearch placeholder="Select users" optionFilterProp="children">
              {users.map((u) => (
                <Option key={u.userId} value={u.userId}>
                  {u.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Time tracking */}
          <div>
            <label className="font-medium block mb-2">Time tracking</label>
            <Slider min={0} max={spent + remaining} value={spent} tooltip={{ open: false }} />
            <div className="flex justify-between text-gray-500 text-sm">
              <span>{spent}h logged</span>
              <span>{remaining}h remaining</span>
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
          <ReactQuill theme="snow" placeholder="Enter task description..." style={{ height: 200 }} />
        </Form.Item>

        {/* Submit */}
        <Form.Item style={{ marginTop: 24 }}>
          <div className="flex justify-end space-x-2 ">
            <Button>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTaskPage;
