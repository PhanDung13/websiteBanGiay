import {
  EditOutlined,
  HomeOutlined,
  LoginOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Form, Input, message, Space, Tooltip } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { LOCAL_STORAGE } from "constants/localstorage";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUser, logOut } from "redux/authSlice";
import { UserServices } from "services/user-service";
import "./style.scss";
import UpdatePassword from "./UpdatePassword";
import UploadImage from "./UploadImage";
moment.locale("vi");
const InforUser = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isInformation, setIsInformation] = useState(false);
  const userServices = new UserServices();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const onLogout = () => {
    dispatch(logOut());
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
  };
  useEffect(() => {
    const getInfor = async () => {
      const res = await userServices.getInfo();
      dispatch(getUser({ user: res, isAdmin: res.role === 1 ? true : false }));
    };
    getInfor();
  }, []);
  const handleUpdateName = async (value) => {
    setIsUpdate(false);

    await userServices.updateUser({
      avatar: user.avatar,
      ...value,
      phone: value.phone.toString(),
    });
    message.success("Cập nhập thông tin thành công");
    const getInforUser = async () => {
      const dataUser = await userServices.getInfo();
      dispatch(
        getUser({ user: dataUser, isAdmin: dataUser.role === 1 ? true : false })
      );
    };
    getInforUser();
  };
  return (
    <>
      <div className="profile">
        <div className="avatar-user">
          <img src={user?.avatar} alt="" onClick={() => setVisible(true)} />
        </div>
        <div className="group-information1">
          <Drawer
            title="Thông tin"
            width={400}
            onClose={() => setVisible(false)}
            visible={visible}
            className="container-information"
          >
            <div className="information">
              <UploadImage avatar={user?.avatar} />
              <div className="create-account">
                <Tooltip
                  placement="top"
                  title={moment(user?.createdAt).format("LLLL")}
                >
                  <span>{moment(user?.createdAt).fromNow()}</span>
                </Tooltip>
              </div>
              <div className="ground-information">
                <div className="group-information1">
                  <Form
                    form={form}
                    autoComplete="off"
                    initialValues={{
                      name: user?.name,
                      phone: user?.phone,
                      address: user?.address,
                    }}
                  >
                    <FormItem
                      name="name"
                      pattern={[/^[a-z0-9]/]}
                      rules={[
                        {
                          required: true,
                          message: "Nhập đầy đủ tên bạn !",
                          whitespace: true,
                          type: "string",
                        },
                        {
                          min: 1,
                          max: 25,
                          message: "Vui lòng nhập đúng tên của bạn !",
                        },
                      ]}
                    >
                      <div className="group-infor2">
                        <UserOutlined className="icon-user-information" />

                        <div className="edit">
                          <Input
                            className={!isUpdate ? "boder-none " : ""}
                            disabled={!isUpdate}
                            defaultValue={user?.name}
                            placeholder="Họ tên"
                          />
                          <EditOutlined
                            className="icon-user-information"
                            style={{ marginLeft: "8px" }}
                            onClick={() => setIsUpdate(!isUpdate)}
                          />
                        </div>
                      </div>
                    </FormItem>
                    <FormItem
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Nhập đầy số điện thoại !",
                          type: "string",
                        },
                        {
                          message: "Sai định dạng số điện thoại",
                          pattern: new RegExp(/^[0-9]+$/),
                        },
                        {
                          message: "Sai định dạng số điện thoại",
                          max: 11,
                        },
                        {
                          message: "Sai định dạng số điện thoại",
                          min: 10,
                        },
                      ]}
                    >
                      <div className="group-infor2">
                        <PhoneOutlined className="icon-user-information" />
                        <div>
                          <Input
                            className={!isUpdate ? "boder-none " : ""}
                            defaultValue={user?.phone}
                            placeholder={"Số điện thoại"}
                            disabled={!isUpdate}
                          />
                        </div>
                      </div>
                    </FormItem>
                    <FormItem
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Nhập địa chỉ của bạn !",
                          whitespace: true,
                          type: "string",
                        },
                      ]}
                    >
                      <div className="group-infor2">
                        <HomeOutlined className="icon-user-information" />
                        <div>
                          <Input
                            className={!isUpdate ? "boder-none " : ""}
                            defaultValue={user?.address}
                            placeholder="Địa chỉ"
                            disabled={!isUpdate}
                          />
                        </div>
                      </div>
                    </FormItem>
                  </Form>
                </div>
                {isUpdate && (
                  <div className="group-edit-user" style={{ marginLeft: 130 }}>
                    <Form form={form} onFinish={handleUpdateName}>
                      <Space>
                        <Button key="back" onClick={() => setIsUpdate(false)}>
                          Hủy
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button btn-login"
                        >
                          Cập nhật
                        </Button>
                      </Space>
                    </Form>
                  </div>
                )}

                <div className="group-information">
                  <MailOutlined className="icon-user-information" />
                  <div className="group-information-content">
                    <span>{user?.email}</span>
                  </div>
                </div>
                <div className="group-information">
                  <ShoppingCartOutlined className="icon-user-information" />
                  <div className="group-information-content">
                    <Link
                      onClick={() => {
                        setVisible(false);
                      }}
                      className="inForUser"
                      to="/history-cart"
                    >
                      Lịch sử mua hàng
                    </Link>
                  </div>
                </div>
                <div className="group-information">
                  <LoginOutlined className="icon-user-information btn-logout" />
                  <div className="group-information-content">
                    <button className="logout" onClick={onLogout}>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
              <div className="change-information">
                <Button
                  block
                  type="primary"
                  onClick={() => setIsInformation(true)}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
      {isInformation && (
        <UpdatePassword
          isInformation={isInformation}
          setIsInformation={setIsInformation}
        />
      )}
    </>
  );
};

export default InforUser;
