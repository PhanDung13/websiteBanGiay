import { DeleteFilled, FileTextOutlined } from "@ant-design/icons";
import { message, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateCart, deleteCart } from "redux/cartSlice";
import { ProductService } from "services/product-service";
import CheckOut from "./CheckOut";
import "./style.css";
export default function CartProduct() {
  const dataCart = useSelector((state) => state.cart).cart;
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const formatter = new Intl.NumberFormat("vn");
  const [dataProduct, setDataProduct] = useState([]);
  const productService = new ProductService();
  useEffect(() => {
    const getProduct = async () => {
      const res = await productService.getProducts({ limit: 1000000 });
      setDataProduct(res.products);
    };
    getProduct();
  }, []);
  console.log(dataProduct);
  useEffect(() => {
    const sumPrice = dataCart.reduce((pre, item) => {
      return pre + item.product.price * item.quantity;
    }, 0);
    setTotal(sumPrice);
  }, [dataCart]);

  const increment = (quantity, index) => {
    const [product] = dataProduct.filter((item) => {
      return item._id === dataCart[index].product._id;
    });
    const {
      product: { size },
    } = dataCart[index];
    let maxQuantity = 0;
    product.sizeQuantity.forEach((item) => {
      if (item.size === size) {
        maxQuantity = item.quantity;
      }
    });
    if (quantity + 1 <= maxQuantity) {
      dispatch(updateCart({ index, quantity: quantity + 1 }));
      message.success("Cập nhập giỏ hàng thành công");
    } else {
      message.error(
        `Bạn đã có ${maxQuantity} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
      );
    }
  };
  const decrement = (quantity, index) => {
    // const soluong = Math.max(1, quantity - 1);
    if (quantity - 1 === 0) {
      message.error("Không thể giảm số lượng trong giỏ hàng");
    } else {
      dispatch(updateCart({ index, quantity: quantity - 1 }));
      message.success("Cập nhập giỏ hàng thành công");
    }
  };
  const handleDeleteCart = (index) => {
    dispatch(deleteCart(index));
    message.success("Xóa sản phẩm thành công");
  };
  return (
    <div className="container-card">
      <div className="group-card">
        <h3>
          GIỎ HÀNG <span>({dataCart.length} sản phẩm)</span>
        </h3>
        {dataCart.length === 0 && (
          <div className="no-data-cart">
            <FileTextOutlined
              style={{
                fontSize: "2em",
                margin: "15px auto",
              }}
            />
            <h3>Không có sản phẩm nào trong giỏ hàng của bạn.</h3>
            <Link to="/">Tiếp tục mua sắm</Link>
          </div>
        )}
        {dataCart.length > 0 && (
          <div className="group-card-item">
            <div className="frames-card-item">
              {dataCart.map((card, index) => (
                <div className="card-items" key={index}>
                  <button
                    className="delete-item"
                    onClick={() => {
                      handleDeleteCart(index);
                    }}
                  >
                    <Tooltip placement="right" title="Xóa sản phẩm">
                      <DeleteFilled style={{ fontSize: 18 }} />
                    </Tooltip>
                  </button>
                  <div className="card-image">
                    <img
                      src={card.product?.images[0]?.url}
                      alt={card.product._id}
                      title="Xem chi tiết"
                    />
                  </div>
                  <div className="card-name">
                    <Link
                      title="Xem chi tiết"
                      to={`/detail/${card.product._id}`}
                    >
                      <p>
                        {console.log(card.product)}
                        {card.product.name} -{" "}
                        <span>size {card.product.size}</span>
                      </p>
                    </Link>
                  </div>
                  <div className="card-rice">
                    <span>Giá</span>
                    <p>
                      {formatter.format(card.product.price)} <u>đ</u>
                    </p>
                  </div>
                  <div className="card-quantity">
                    <span>Số lượng</span>
                    <div className="quantity-number">
                      <button
                        className="click-left"
                        onClick={() => decrement(card.quantity, index)}
                      >
                        -
                      </button>
                      <div>{card.quantity}</div>
                      <button
                        className="click-right"
                        onClick={() => increment(card.quantity, index)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="total-sum">
                    Tổng cộng:{" "}
                    {formatter.format(card.quantity * card.product.price)}{" "}
                    <u>đ</u>{" "}
                  </p>
                </div>
              ))}
            </div>
            <div className="card-total-money">
              <div className="total-money">
                <h3>Thành tiền</h3>
                <div className="group-total-money">
                  <p>
                    {formatter.format(total)} <u>đ</u>
                  </p>
                  <span>(Đã bao gồm VAT nếu có)</span>
                </div>
                <button className="check-out" onClick={() => setVisible(true)}>
                  Tiến hành đặt hàng
                </button>
              </div>
            </div>
          </div>
        )}
        {visible && (
          <CheckOut
            visible={visible}
            setVisible={setVisible}
            dataCart={dataCart}
          />
        )}
      </div>
    </div>
  );
}
