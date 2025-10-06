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
      console.error(err);
      message.error("Không thể tải thông tin project!");
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
      onSuccess(); // reload list
      onCancel(); // đóng modal
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={<h2 className="font-semibold mb-2">Edit Project</h2>}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Submit"
      cancelText="Cancel"
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical">
        {/* 3 input ngang hàng */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Project id" name="id">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Project name"
              name="projectName"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
            >
              <Input placeholder="Nhập tên project..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Project Category"
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

        {/* TinyMCE editor */}
        <Form.Item label="Description">
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
