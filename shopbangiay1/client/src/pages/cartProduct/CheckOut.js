import { Button, Drawer, Form, Input, message, Select } from "antd";
import Dashboard from "components/admin/dashboard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyMiddleware } from "redux";
import { removeCart } from "redux/cartSlice";
import { OrderService } from "services/order-service";
import dataCity from "../../data.json";

const { Option } = Select;

export default function CheckOut({ visible, setVisible, dataCart }) {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [display, setDisplay] = useState(true);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      setDisplay(false);
    }
  }, [user]);
  const orderService = new OrderService();
  const dispatch = useDispatch();
  const onChangeCity = (City) => {
    setCity(City);
  };
  const onChangeDistrict = (District) => {
    setDistrict(District);
  };
  const checkOutDefaultAdress = async ({ payment, note }) => {
    console.log(payment);
    let totalSumCart = 0;
    console.log(dataCart);
    if (dataCart.length > 0) {
      for (let index = 0; index < dataCart.length; index++) {
        totalSumCart +=
          dataCart[index].product.price * dataCart[index].quantity;
      }
    }

    const cartInformation = {
      address: user.address,
      phone: user.phone,
      totalSum: totalSumCart,
      order_detail: dataCart,
      payment: payment,
      status_order: 0,
      note: note,
      id_user: user?._id,
    };
    try {
      const res = await orderService.createOrder(cartInformation);
      dispatch(removeCart());
      setVisible(false);
      if (res.type === "success") {
        message.success("Đặt hàng thành công");
      } else {
        message.error("Đặt hàng thất bại do số lượng không đủ");
      }
    } catch (error) {
      console.log(error);
      message.error("Đặt hàng thất bại");
    }
  };
  const checkOutCart = async (value) => {
    let totalSumCart = 0;
    if (dataCart.length > 0) {
      for (let index = 0; index < dataCart.length; index++) {
        totalSumCart +=
          dataCart[index].product.price * dataCart[index].quantity;
      }
    }
    const { city, district, commune, incubation, numberPhone, payment, note } =
      value;
    const cartInformation = {
      address: `${incubation} - ${commune} - ${district} - ${city}`,
      phone: numberPhone,
      totalSum: totalSumCart,
      order_detail: dataCart,
      payment: payment,
      status_order: 0,
      note: note,
      id_user: user?._id,
    };
    try {
      const res = await orderService.createOrder(cartInformation);
      dispatch(removeCart());
      setVisible(false);
      if (res.type === "success") {
        message.success("Đặt hàng thành công");
      } else {
        message.error("Đặt hàng thất bại do số lượng không đủ");
      }
    } catch (error) {
      message.error("Đặt hàng thất bại");
    }
  };
  //
  useEffect(() => {
    form.resetFields(["district"]);
    form.resetFields(["commune"]);
  }, [city]);
  useEffect(() => {
    form.resetFields(["commune"]);
  }, [district]);
  const onChangeAddress = (value) => {
    if (value === 1) setDisplay(true);
    else {
      setDisplay(false);
    }
  };
  return (
    <>
      <div className="group-check-out">
        <Drawer
          title="Thông tin nhận hàng"
          width={500}
          onClose={() => setVisible(false)}
          visible={visible}
          className="container-checkout"
        >
          {user && (
            <Form layout="vertical">
              <Form.Item
                name="city"
                label="Địa chỉ nhận hàng"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng địa chỉ nhận hàng !",
                  },
                ]}
              >
                <Select defaultValue={user.address} onChange={onChangeAddress}>
                  <Option value={user.address}>{user.address}</Option>
                  <Option value={1}>Địa chỉ mới</Option>
                  {}
                </Select>
              </Form.Item>
            </Form>
          )}
          {display && (
            <Form form={form} onFinish={checkOutCart} layout="vertical">
              <Form.Item
                name="city"
                label="Tỉnh/Thành phố"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tỉnh hoặc thành phố bạn ở !",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Tỉnh/Thành phố"
                  optionFilterProp="children"
                  onChange={onChangeCity}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dataCity.map((city, index) => (
                    <Option value={city.name} key={index}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="district"
                label="Quận/Huyện"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn quận hoặc huyện nơi bạn !",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Quận/Huyện"
                  optionFilterProp="children"
                  onChange={onChangeDistrict}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dataCity.map(
                    (itemCity, index) =>
                      itemCity.name === city &&
                      itemCity.huyen.map((huyen) => (
                        <Option value={huyen.name} key={index}>
                          {huyen.name}
                        </Option>
                      ))
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                name="commune"
                label="Xã/Thị Trấn"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn xã bạn ở !",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Xã/Thị Trấn"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dataCity.map(
                    (itemCity) =>
                      itemCity.name === city &&
                      itemCity.huyen.map(
                        (huyen) =>
                          huyen.name === district &&
                          huyen.xa.sort().map((xa, index) => (
                            <Option value={xa.name} key={index}>
                              {xa.name}
                            </Option>
                          ))
                      )
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                name="incubation"
                label="Ấp/Số Nhà/Tên Đường"
                rules={[
                  {
                    required: true,
                    message: "Địa chỉ cụ thể !",
                  },
                ]}
              >
                <TextArea
                  maxLength={150}
                  placeholder="địa chỉ cụ thể: ấp, số nhà, tên đường..."
                  rows={4}
                />
              </Form.Item>
              <Form.Item
                name="numberPhone"
                label="Số Điện Thoại"
                className="group-phone"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đúng số điện thoại !",
                  },
                  {
                    message: "Sai định dạng số điện thoại",
                    pattern: new RegExp(/^[0-9]+$/),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="note" label="Ghi chú">
                <TextArea maxLength={150} placeholder="Ghi chú" rows={4} />
              </Form.Item>
              <Form.Item
                name="payment"
                label="Thanh toán"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phuong thức thanh toán",
                  },
                ]}
              >
                <Select placeholder="Thanh toán khi nhận hàng">
                  <Option value="Thanh toán khi nhận hàng">
                    Thanh toán khi nhận hàng
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-register"
                >
                  Đặt hàng ngay
                </Button>
              </Form.Item>
            </Form>
          )}
          {!display && (
            <Form
              form={form}
              onFinish={checkOutDefaultAdress}
              layout="vertical"
            >
              <Form.Item name="note" label="Ghi chú">
                <TextArea
                  maxLength={150}
                  placeholder="địa chỉ cụ thể: ấp, số nhà, tên đường..."
                  rows={4}
                />
              </Form.Item>
              <Form.Item
                name="payment"
                label="Thanh toán"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phuong thức thanh toán",
                  },
                ]}
              >
                <Select placeholder="Thanh toán khi nhận hàng">
                  <Option value="Thanh toán khi nhận hàng">
                    Thanh toán khi nhận hàng
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-register"
                >
                  Đặt hàng ngay
                </Button>
              </Form.Item>
            </Form>
          )}
        </Drawer>
      </div>
    </>
  );
}
