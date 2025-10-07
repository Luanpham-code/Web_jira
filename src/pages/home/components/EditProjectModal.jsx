// src/pages/home/components/EditProjectModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Row, Col, message } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { projectService } from "../../../service/projectService";

const { Option } = Select;

const EditProjectModal = ({ visible, onCancel, projectId, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  // 🔹 Load thông tin project khi mở modal
  useEffect(() => {
    if (visible && projectId) {
      loadProjectDetail();
    }
  }, [visible, projectId]);

  const loadProjectDetail = async () => {
    try {
      const res = await projectService.getProjectDetail(projectId);
      const project = res.data.content;
      form.setFieldsValue({
        id: project.id,
        projectName: project.projectName,
        categoryId: project.projectCategory?.id,
      });
      setDescription(project.description || "");
    } catch (err) {
      console.error("❌ Lỗi getProjectDetail:", err);
      if (err.response?.status === 401) {
        message.error("Token không hợp lệ hoặc đã hết hạn!");
      } else if (err.response?.status === 404) {
        message.error("Không tìm thấy project!");
      } else {
        message.error("Không thể tải thông tin project!");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const dataSubmit = {
        ...values,
        description,
      };
      setLoading(true);
      await projectService.updateProject(projectId, dataSubmit);
      message.success("Cập nhật thành công!");
      onSuccess?.(); // reload list
      onCancel(); // đóng modal
    } catch (err) {
      console.error("❌ Lỗi updateProject:", err);
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={<h2 className="text-xl font-semibold text-center">✏️ Edit Project</h2>}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      width={800}
      className="rounded-xl"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Project ID" name="id">
              <Input disabled className="bg-gray-100" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Tên dự án"
              name="projectName"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
            >
              <Input placeholder="Nhập tên project..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Loại dự án"
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn loại dự án" }]}
            >
              <Select placeholder="Chọn loại dự án">
                <Option value="1">Dự án phần mềm</Option>
                <Option value="2">Dự án di động</Option>
                <Option value="3">Dự án web</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả chi tiết">
          <Editor
            apiKey="v561vo0qd1fz3juphckx6kd8ba7njqvi8rcv4n8klx87h4kn"
            value={description}
            onEditorChange={(content) => setDescription(content)}
            init={{
              height: 250,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
