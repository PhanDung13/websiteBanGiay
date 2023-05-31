import {
  CheckCircleOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Image,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
} from "antd";
import Loading from "pages/LoadingPage";
import React, { useEffect, useState } from "react";
import { UserServices } from "services/user-service";

const User = () => {
  const [data, setData] = useState();
  const [call, setCall] = useState();
  const userService = new UserServices();
  const [loading, setLoading] = useState(false);
  const deleteCart = (user) => {
    Modal.confirm({
      title: "Bạn có chắc chắn xóa tài khoản này không ?.",
      icon: <ExclamationCircleOutlined />,
      width: 500,
      okText: "tiếp tục",
      cancelText: "hủy",
      onOk() {
        const deleteuser = async () => {
          await userService.deleteUser({ id: user._id });
          console.log(user._id);
          setCall(!call);
          message.success("Xóa đơn hàng thành công");
        };
        deleteuser();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const onChangeAdmin = async (value) => {
    console.log(value);
    let a = 0;
    if (value.role === 0) {
      a = 1;
    }
    await userService.updateRole({ id: value._id, role: a });
  };
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Hình ảnh",
      key: "avatar",
      dataIndex: "avatar",
      render: (image) => (
        <div className="product-imgs">
          <Image src={image} style={{ width: 70 }} alt={"img"} />
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Quyền quản trị",
      key: "action",
      render: (text, record) => {
        console.log(record);

        if (record.email === "phananhdung2018601781@gmail.com") {
          return <Tag color="success">Admin</Tag>;
        } else {
          return (
            <Switch
              defaultChecked={record.role === 1}
              onChange={() => onChangeAdmin(record)}
            />
          );
        }
      },
    },
    {
      title: "Xóa",
      key: "delete",
      key: "action",
      render: (record) => {
        if (record.email === "phananhdung2018601781@gmail.com") {
          return <Tag color="success">Admin</Tag>;
        } else {
          return (
            <DeleteFilled
              onClick={() => deleteCart(record)}
              style={{ fontSize: 20, color: "red", cursor: "pointer" }}
            />
          );
        }
        // return <div>{record === 1 ? "Admin" : "khách hàng"}</div>;
      },
    },
  ];

  const confirm = async (e) => {
    console.log(e);
    try {
      setCall(!call);
      message.success("Xóa thành công");
    } catch (error) {
      message.error(error.response.data.msg);
    }
  };
  useEffect(() => {
    const getAllUser = async () => {
      setLoading(true);
      let res = await userService.getAllInfor();
      res = res.map((item) => {
        return { ...item, key: item._id };
      });
      setData(res);
    };
    getAllUser();
    setLoading(false);
  }, [call]);
  return (
    <div className="user-admin">
      {loading ? (
        <Loading />
      ) : (
        <Table columns={columns} dataSource={data && data} />
      )}
    </div>
  );
};

export default User;
