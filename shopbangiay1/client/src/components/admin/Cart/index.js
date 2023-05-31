import { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileTextOutlined } from "@ant-design/icons";
import { Select, Pagination } from "antd";

import CartItem from "./CartItem";

import CartInForBuy from "./CartInForBuy";

import "./style.css";
import { OrderService } from "services/order-service";
import Loading from "pages/LoadingPage";
export default function ListProduct() {
  document.querySelector("title").innerHTML = "Danh sách mua hàng";
  const { Option } = Select;
  const orderService = new OrderService();
  const [data, setData] = useState([]);
  const [call, setCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(10);
  useEffect(() => {
    const getAllOrder = async () => {
      setLoading(true);
      const res = await orderService.getAllOrder({ status: sort });
      console.log(res);
      setData(res);
      setLoading(false);
    };
    getAllOrder();
  }, [call, sort]);

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState(1);
  // dispatch API
  const hangdlesortOrder = (value) => {
    console.log(value);
    setSort(value.value);
  };
  return (
    <div className="ground-admin-list">
      <div className="container-admin-list">
        <div className="filter-success">
          <h3>Tất Cả Danh Sách Mua Hàng </h3>
          <Select
            labelInValue
            defaultValue={10}
            style={{ width: "160px" }}
            onChange={hangdlesortOrder}
          >
            <Option value={10}>Tất Cả Giỏ Hàng</Option>
            <Option value={-1}>Đã Hủy</Option>
            <Option value={0}>Chờ Xét Duyệt</Option>
            <Option value={1}>Đang giao</Option>
            <Option value={2}>Đã giao</Option>
          </Select>
        </div>
        <div className="main-admin-list">
          {data.length === 0 && (
            <div className="no-cart">
              <FileTextOutlined style={{ fontSize: "24px", marginTop: 20 }} />
              <h4>Không có gì để hiển thị</h4>
            </div>
          )}
          {loading && <Loading />}
          {!loading &&
            data?.map((cartItems, index) => (
              <div className="cart-items" key={index}>
                <CartItem data={cartItems} key={index} />
                <CartInForBuy
                  cart={cartItems}
                  userByCart={cartItems.user}
                  id_cart={cartItems.order_detail._id}
                  call={call}
                  setCall={setCall}
                />
              </div>
            ))}
          {
            // <Pagination
            //   onChange={onChangePagination}
            //   total={length}
            //   defaultPageSize={limit}
            //   current={current}
            //   style={{
            //     textAlign: "center",
            //   }}
            // />
          }
        </div>
      </div>
    </div>
  );
}
