import { useState } from "react";
import { Button, Modal, Form, Input, Image, message } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import "moment/locale/vi";
import {
  LoadingOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { OrderService } from "services/order-service";
const formatter = new Intl.NumberFormat("vn");
export default function CartInForBuy({ cart, call, setCall, id_cart }) {
  //store
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isMessage, setIsMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contentMessage, setContentMessage] = useState("");
  // function
  const orderService = new OrderService();

  const onChangeFromMessage = async () => {
    const dataMessage = {
      id: cart._id,
      message: contentMessage,
    };
    await orderService.updateMessage(dataMessage);
    message.success("Báo cáo thành công");
    setCall(!call);
    setIsMessage(false);
  };
  const onChangeTextArea = (e) => {
    setContentMessage(e.target.value.trim());
  };
  const comfirmOrder = async () => {
    try {
      const res = await orderService.updateStatus({ id: cart._id, status: 1 });
      setCall(!call);
      message.success("Xác nhận đơn hàng thành công");
    } catch (error) {
      message.error("Xác nhận đơn hàng thất bại");
    }
  };
  const handleGiaoHang = async () => {
    try {
      const res = await orderService.updateStatus({ id: cart._id, status: 2 });
      setCall(!call);
      message.success("Đơn hàng đã được giao thành công");
    } catch (error) {
      message.error("Lỗi");
    }
  };
  const deleteCart = (id_cart) => {
    Modal.confirm({
      title: "Bạn có chắc chắn xóa đơn hàng này không ?.",
      icon: <ExclamationCircleOutlined />,
      width: 500,
      okText: "tiếp tục",
      cancelText: "hủy",
      onOk() {
        const deleteorder = async () => {
          await orderService.deleteOrder({ id: id_cart });
          setCall(!call);
          message.success("Xóa đơn hàng thành công");
        };
        deleteorder();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <>
      <div className="group-info-buy-cart">
        <h5>
          Tổng Số Tiền
          <p>
            {formatter.format(cart.totalSum)} <u>đ</u>
          </p>
        </h5>
        <div className="button-more-info">
          <Button
            type="primary"
            className="btn-error"
            onClick={() => setIsMessage(true)}
          >
            <MessageOutlined /> Báo cáo lỗi
          </Button>
          {cart.status_order === 0 && (
            <Button
              disabled={cart.success ? true : false}
              type="primary"
              className={cart.success ? "btn-success-order" : "btn-wait-order"}
              onClick={() => {
                comfirmOrder(id_cart);
              }}
            >
              Xác nhận đơn hàng
            </Button>
          )}
          {cart.status_order === 1 && (
            <Button
              type="primary"
              className="btn-success-order"
              onClick={handleGiaoHang}
            >
              <CheckCircleOutlined /> Hoàn thành đơn hàng
            </Button>
          )}
          {cart.status_order === 2 && (
            <Button type="primary" className="btn-success-order">
              <CheckCircleOutlined /> Đã giao thành công
            </Button>
          )}
          <Button
            type="primary"
            className="btn-delete-order"
            onClick={() => {
              deleteCart(cart._id);
            }}
          >
            <DeleteOutlined /> Xóa giỏ hàng
          </Button>
          {cart.message && <p className="message">{cart.message}</p>}
        </div>
        {cart.status_order === -1 && (
          <span className="cancel">Đơn hàng đã hủy</span>
        )}
        <div className="ground-address-cart">
          <div className="group-address-modal">
            <span>Địa Chỉ:</span> <p>{cart.address}</p>
          </div>
          <div className="group-phone-modal">
            <span>Số Điện Thoại:</span> <p>{cart.phone}</p>
          </div>
          <div className="group-payment-modal">
            <span>Thanh Toán:</span> <p>{cart.payment}</p>
          </div>
          <div className="group-time-modal">
            <span>Ngày Đặt Hàng:</span>
            <p>
              {`${moment(cart.createdAt).fromNow()}, ${moment(
                cart.createdAt
              ).format("LLLL")}`}
            </p>
          </div>

          <div className="ground-user-by-cart">
            <ul>
              <li>
                {" "}
                <span>Tên:</span>
                <p className="name-user-by-cart">{cart?.id_user?.name}</p>
              </li>
              <li>
                {" "}
                <span>Email:</span>
                <p>{cart?.id_user?.email}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/*  */}
      <Modal
        visible={isMessage}
        title="Thông Báo Message"
        onCancel={() => setIsMessage(false)}
        className="ground-message"
        footer={[
          <Form form={form} onFinish={onChangeFromMessage}>
            <Button key="back" onClick={() => setIsMessage(false)}>
              Hủy
            </Button>
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              loading={loading}
              disabled={contentMessage ? false : true}
            >
              cập Nhật
            </Button>
          </Form>,
        ]}
      >
        <Form.Item name="message">
          <TextArea
            placeholder="Mời bạn để lại bình luận"
            rows={5}
            max={20}
            onChange={onChangeTextArea}
            maxLength={150}
            id="message"
          />
          <p className="length-content-message">{contentMessage.length}/100</p>
        </Form.Item>
      </Modal>
    </>
  );
}
