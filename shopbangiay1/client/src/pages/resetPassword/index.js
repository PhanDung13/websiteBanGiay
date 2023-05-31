import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import "./style.scss";

export default function ResetPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  console.log(token);
  const forgotPassword = async (value) => {
    console.log(value);
    if (value) {
      try {
        const url = process.env.REACT_APP_API_ENDPOINT + "/auth/reset";
        const res = await axios.post(
          url,
          {
            password: value.password,
          },
          {
            headers: {
              Authorization: `Bearse ${token}`,
            },
          }
        );
        message.success(res.data.msg);
      } catch (err) {
        message.error("Lỗi");
      }
      setLoading(true);
      setLoading(false);
      form.resetFields(["password"]);
      form.resetFields(["confirm"]);
    }
  };
  return (
    <div className="resetpassword">
      <h1>Đặt lại mật khẩu</h1>
      <Form form={form} onFinish={forgotPassword}>
        <Form.Item
          className="input-password"
          name="password"
          rules={[
            {
              min: 6,
              message: "Mật khẩu quá ngắn ít nhất 6 ký tự !",
            },
            {
              required: true,
              type: "string",
              message: "Vui lòng nhập mật khẩu của bạn !",
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhập lại mật khẩu !",
              type: "string",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu bạn đã nhập không khớp !");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
