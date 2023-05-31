import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import { useHistory } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
// API
// Component
import CartItem from "./CartItem";
import CartInForBuy from "./CartInForBuy";
import Loading from "pages/LoadingPage";

// Context
import "./style.css";
import { OrderService } from "services/order-service";
const { TabPane } = Tabs;
export default function HistoryCart() {
  document.querySelector("title").innerHTML = "Lịch sử mua hàng";
  const dispatch = useDispatch();
  const history = useHistory();
  const [call, setCall] = useState(false);
  const [dataHistoryCart, setDataHistoryCart] = useState();
  const { user } = useSelector((state) => state.auth);
  const orderService = new OrderService();
  useEffect(() => {
    const getOrderByUser = async () => {
      const res = await orderService.getOrderbyUser({ id: user._id });
      setDataHistoryCart(res);
    };
    getOrderByUser();
  }, [call]);
  const showProductsBuyCartAll = (CartData) => {
    return CartData?.map((itemCart, index) => (
      <div className="cart-item-history" key={index}>
        {itemCart.order_detail.map((cart, index) => (
          <CartItem data={cart} key={index} />
        ))}
        <CartInForBuy
          data={itemCart}
          call={call}
          setCall={setCall}
          id_card={itemCart._id}
        />
      </div>
    ));
  };
  // show Pending
  const showProductsBuyCartAllPending = (CartData) => {
    return CartData?.map(
      (itemCart, index) =>
        itemCart.status_order === 0 && (
          <div className="cart-item-history" key={index}>
            {itemCart.order_detail.map((cart, index) => (
              <CartItem data={cart} key={index} />
            ))}
            <CartInForBuy
              call={call}
              setCall={setCall}
              data={itemCart}
              id_card={itemCart._id}
            />
          </div>
        )
    );
  };

  // show Pending Finish
  const showProductsBuyCartAllFinish = (CartData) => {
    return CartData?.map(
      (itemCart, index) =>
        itemCart.status_order === 1 && (
          <div className="cart-item-history" key={index}>
            {itemCart.order_detail.map((cart, index) => (
              <CartItem data={cart} key={index} />
            ))}
            <CartInForBuy
              call={call}
              setCall={setCall}
              data={itemCart}
              id_card={itemCart._id}
            />
          </div>
        )
    );
  };
  const showProductsBuyCartFinal = (CartData) => {
    return CartData?.map(
      (itemCart, index) =>
        itemCart.status_order === 2 && (
          <div className="cart-item-history" key={index}>
            {itemCart.order_detail.map((cart, index) => (
              <CartItem data={cart} key={index} />
            ))}
            <CartInForBuy
              call={call}
              setCall={setCall}
              data={itemCart}
              id_card={itemCart._id}
            />
          </div>
        )
    );
  };
  // show  status order
  const showProductsBuyCartStatusOrder = (CartData) => {
    return CartData?.map(
      (itemCart, index) =>
        itemCart.status_order === -1 && (
          <div className="cart-item-history" key={index}>
            {itemCart.order_detail.map((cart, index) => (
              <CartItem data={cart} key={index} />
            ))}
            <CartInForBuy
              call={call}
              setCall={setCall}
              data={itemCart}
              id_card={itemCart._id}
            />
          </div>
        )
    );
  };

  return (
    <div className="group-history-cart">
      <div className="container-history-cart">
        <h3>
          LỊCH SỬ MUA HÀNG<span>({dataHistoryCart?.length} sản phẩm)</span>
        </h3>

        {
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tất Cả" key="1">
              {showProductsBuyCartAll(dataHistoryCart)}
            </TabPane>
            <TabPane tab="Chờ Duyệt" key="2">
              {showProductsBuyCartAllPending(dataHistoryCart)}
            </TabPane>
            <TabPane tab="Đang Giao" key="3">
              {showProductsBuyCartAllFinish(dataHistoryCart)}
            </TabPane>
            <TabPane tab="Đã giao" key="4">
              {showProductsBuyCartFinal(dataHistoryCart)}
            </TabPane>
            <TabPane tab="Đã Hủy" key="5">
              {showProductsBuyCartStatusOrder(dataHistoryCart)}
            </TabPane>
          </Tabs>
        }
        {dataHistoryCart?.length === 0 && (
          <div className="no-history-cart">
            <FileTextOutlined
              style={{
                fontSize: "2em",
                margin: "15px auto",
              }}
            />
            <h4>Không có gì để hiển thị</h4>
          </div>
        )}
      </div>
    </div>
  );
}
