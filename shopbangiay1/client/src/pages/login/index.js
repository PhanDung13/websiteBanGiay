import {
  GooglePlusOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";
import popup from "components/common/Popup/index";
import { LOCAL_STORAGE } from "constants/localstorage";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { loginSuccess } from "redux/authSlice";
import { AuthServices } from "services/auth-service";
import { UserServices } from "services/user-service";
import * as Yup from "yup";
import "./style.css";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
      pd: 0,
    },
    sm: {
      span: 24,
    },
    lg: {
      span: 24,
    },
    xl: {
      span: 24,
    },
  },
};
const Login = () => {
  const [form] = Form.useForm();
  const user = {
    email: "",
    password: "",
  };
  const [formForget] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isForgotPassword, setIsForgetPassword] = useState(false);
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: Yup.string().required("Mật khẩu không được để trống"),
  });
  const authServices = new AuthServices();
  const handleRegister = async (values) => {
    try {
      console.log(values);
      const result = await authServices.login(values);
      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, result.accesstoken);
      // const res = await authServices.refreshToken();
      // console.log({ result, res });
      localStorage.setItem(LOCAL_STORAGE.REFESH_TOKEN, result.accesstoken);
      dispatch(loginSuccess());
      popup("Đăng nhập", "Đăng nhập thành công", "success");
      history.push("/");
    } catch (err) {
      console.log(err.response.data);
      popup("Đăng nhập", `${err.response.data.msg}`, "error");
    }
  };
  const userServices = new UserServices();
  const handleEmail = async (value) => {
    console.log(value.email);
    try {
      await userServices.forgot({ email: value.email });
      message.success("Vui lòng kiểm tra và xác nhận email");
      setIsForgetPassword(false);
    } catch (error) {
      message.error("Email không tồn tại !");
      setIsForgetPassword(false);
    }
  };
  return (
    <>
      <div className="group-login">
        <div className="main-login">
          <div className="container-login">
            <h3>Chào Mừng</h3>
            <Form
              {...formItemLayout}
              form={form}
              layout="vertical"
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={handleRegister}
            >
              <Form.Item
                label="Email"
                name="email"
                className="input-email"
                rules={[
                  {
                    type: "email",
                    message: "E-mail không hợp lệ !",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập đúng E-mail !",
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Nhập email"
                  id="email-login"
                />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                className="input-password"
                name="password"
                rules={[
                  {
                    required: true,
                    type: "string",
                    message: "Vui lòng nhập mật khẩu của bạn !",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="nhập mật khẩu"
                />
              </Form.Item>
              <div className="group-login-link">
                <Form.Item shouldUpdate={true}>
                  {() => (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button btn-login"
                      disabled={
                        !form.isFieldsTouched(true) ||
                        form
                          .getFieldsError()
                          .filter(({ errors }) => errors.length).length
                      }
                    >
                      Đăng Nhập
                    </Button>
                  )}
                </Form.Item>
              </div>
            </Form>
            <div className="connect-with-internet"></div>
            <div className="connect-link">
              <p>Bạn chưa có tài khoản đăng ký </p>
              <Link to="/register" className="btn-register">
                tại đây
              </Link>
            </div>
            <div className="forgot-password">
              <p onClick={() => setIsForgetPassword(true)}>Quên mật khẩu</p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        centered
        title="Nhập Email khôi phục mật khẩu"
        visible={isForgotPassword}
        onCancel={() => setIsForgetPassword(false)}
        cancelText="Hủy"
        okText="Gửi Email"
        footer={[
          <Form form={formForget} onFinish={(e) => handleEmail(e)}>
            <Button key="back" onClick={() => setIsForgetPassword(false)}>
              Hủy
            </Button>
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              // loading={loading}
            >
              Gửi Email
            </Button>
          </Form>,
        ]}
      >
        <Form form={formForget}>
          <Form.Item
            name="email"
            className="input-email"
            rules={[
              {
                type: "email",
                message: "E-mail không hợp lệ !",
              },
              {
                required: true,
                message: "Vui lòng nhập đúng E-mail !",
              },
            ]}
            hasFeedback
          >
            <Input prefix={<GooglePlusOutlined />} placeholder="Email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Login;
