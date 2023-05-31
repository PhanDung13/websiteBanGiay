import { Button, Modal, Form, Input, message } from "antd";
import formItemLayout from "./style";
import { useState } from "react";
import { UserServices } from "services/user-service";

export default function UpdatePassword({
  user,
  isInformation,
  setIsInformation,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userServices = new UserServices();
  const onChangeInformationUser = async (value) => {
    console.log(value);
    if (value) {
      try {
        const res = await userServices.updatePassword({
          password: value.password,
          newPassword: value.newPassword,
        });
        console.log(res);
        message.info(res.msg);
      } catch (err) {
        message.error("Mật khẩu cũ không chính xác");
      }
      setLoading(true);
      setLoading(false);
      setIsInformation(false);
      form.resetFields(["password"]);
      form.resetFields(["confirm"]);
    }
  };
  return (
    <Modal
      centered
      visible={isInformation}
      title="Đổi mật khẩu"
      onCancel={() => setIsInformation(false)}
      footer={[
        <Form form={form} onFinish={onChangeInformationUser}>
          <Button key="back" onClick={() => setIsInformation(false)}>
            Hủy
          </Button>
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Lưu mật khẩu
          </Button>
        </Form>,
      ]}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item
          className="input-password"
          name="password"
          rules={[
            {
              required: true,
              type: "string",
              message: "Vui lòng nhập mật khẩu cũ của bạn !",
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Mật khẩu cũ" />
        </Form.Item>
        <Form.Item
          className="input-password"
          name="newPassword"
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
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhập lại mật khẩu !",
              type: "string",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu bạn đã nhập không khớp !");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
