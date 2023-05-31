import React, { useEffect, useState } from "react";
import { Button, DatePicker, Space } from "antd";
import moment from "moment";
import "./style.scss";
import { OrderService } from "services/order-service";
import { TotalRevenue } from "./TotalRevenue";
import { useDispatch, useSelector } from "react-redux";
import { OrderError, OrderRequest, OrderSuccess } from "redux/OrderSlice";
import { AntDesignOutlined } from "@ant-design/icons";
import { ProductService } from "services/product-service";
const { RangePicker } = DatePicker;
const Dashboard = () => {
  const [dateStart, setDateStart] = useState();
  const [dateEnd, setDateEnd] = useState();
  const [quantity, setQuantity] = useState();
  const orderService = new OrderService();
  function onChange(dates, dateStrings) {
    console.log("From: ", dates[0], ", to: ", dates[1]);
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    setDateStart(dateStrings[0]);
    setDateEnd(dateStrings[1]);
  }

  useEffect(() => {
    const getNumber = async () => {
      const res = await orderService.getNumberThongket();
      setQuantity(res);
      console.log(res);
    };
    getNumber();
  }, []);

  const dispatch = useDispatch();
  const handleThongke = async () => {
    let date1 = moment(dateStart, "YYYY-MM-DD");
    date1.format();
    let date2 = moment(dateEnd, "YYYY-MM-DD");
    date2.format();

    try {
      dispatch(OrderRequest());
      const data = await orderService.getOrderTT({
        dateStart: date1,
        dateEnd: date2,
      });
      dispatch(OrderSuccess(data));
    } catch (error) {
      dispatch(OrderError("lỗi"));
    }
  };
  useEffect(() => {
    dispatch(OrderSuccess(null));
  }, []);
  const formatter = new Intl.NumberFormat("vn");
  const { data } = useSelector((state) => state.order);
  return (
    <div>
      <div className="dashboard-container">
        <div className="row">
          <div className="col l-3 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon">
                  <AntDesignOutlined style={{ fontSize: 22 }} />
                </div>
                <div className="content">
                  <h2 className="number">{quantity?.category}</h2>
                  <p className="sub-title">Số lượng thương hiệu</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col l-3 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon">
                  <i className="fa-solid fa-cart-shopping"></i>
                </div>
                <div className="content">
                  <h2 className="number">{quantity?.order}</h2>
                  <p className="sub-title">Số lượng đơn đã bán</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col l-3 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon">
                  <i className="fa-brands fa-product-hunt"></i>
                </div>
                <div className="content">
                  <h2 className="number">{quantity?.product}</h2>
                  <p className="sub-title">Số sản phẩm</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col l-3 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="content">
                  <h2 className="number">{quantity?.user}</h2>
                  <p className="sub-title">Người dùng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="total-revenue">
          <div className="box1">
            <h3>
              Tổng doanh thu {data && formatter.format(data.totalAmount)}{" "}
              {data && <u>đ</u>}
            </h3>
            <div className="box2">
              <RangePicker
                ranges={{
                  Today: [moment(), moment()],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                }}
                onChange={onChange}
              />
              <Button onClick={handleThongke}>Thống kê</Button>
            </div>
          </div>

          <TotalRevenue dateStart={dateStart} dateEnd={dateEnd} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
