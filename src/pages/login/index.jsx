import React, { useState } from "react";
import { Form, Input, Button, message, Card, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "../../service/authService.js";


const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
  try {
    setLoading(true);
    const res = await authService.login(values);

    
    localStorage.setItem("accessToken", res.data.content.accessToken);

    message.success("Đăng nhập thành công!");
    navigate("/projectmanagement");  
  } catch (err) {
    console.log(" Lỗi login:", err.response?.data);
    message.error(err.response?.data?.message || "Đăng nhập thất bại!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card title="Login cyberbugs" className="w-[400px] shadow-lg rounded-xl">
        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Nhập email!" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="passWord"
            rules={[{ required: true, message: "Nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Login
              </Button>

              {/* Nút đăng ký */}
              <Button type="default" block onClick={() => navigate("/register")}>
                Chưa có tài khoản? Đăng ký
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
