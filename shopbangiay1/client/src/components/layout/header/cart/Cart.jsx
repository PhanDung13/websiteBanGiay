import { Badge } from "antd";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./style.scss";
import { useSelector } from "react-redux";
export default function Cart() {
  const dataCart = useSelector((state) => state.cart).cart;
  return (
    <>
      <div className="ground-card">
        <div className="main-card">
          <Badge
            count={dataCart?.length}
            overflowCount={9}
            showZero
            className="length-cart"
          >
            <Link to="/cart" className="head-example">
              <ShoppingCartOutlined className="icon-cart" />
            </Link>
          </Badge>
        </div>
      </div>
    </>
  );
}
