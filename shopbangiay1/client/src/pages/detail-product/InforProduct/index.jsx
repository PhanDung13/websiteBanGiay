import { ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Button, Image, message, Rate } from "antd";
import Slider from "react-slick";
import { addCart } from "redux/cartSlice";
import popup from "components/common/Popup";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";

export default function InForProduct({ product }) {
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <i className="fa fa-angle-left left"></i>
    </button>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <i className="fa fa-angle-right right"></i>
    </button>
  );

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img src={product.images[i].url} alt={product.images[i].public_id} />
        </a>
      );
    },
    dots: true,
    dotsClass: "group-array-image",
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    autoplaySpeed: 3000,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };
  const showReview = (rating, numReviews) => {
    const rate = rating / numReviews;
    if (numReviews > 0) {
      return (
        <>
          <Rate value={rate} disabled />
          <span className="total-review">có {numReviews} Đánh giá</span>
        </>
      );
    } else {
      return (
        <>
          <Rate value={5} disabled />
          <span className="total-review">chưa có đánh giá</span>
        </>
      );
    }
  };
  const [size, setSize] = useState();
  const [soLuong, setSoLuong] = useState(1);

  const [totalSum, setTotalSum] = useState();
  const { cart } = useSelector((state) => state.cart);
  useEffect(() => {
    const total = product?.sizeQuantity.reduce((total, current) => {
      return total + current.quantity;
    }, 0);
    setTotalSum(total);
  }, [product]);
  const preNumber = () => {
    const number = Math.max(1, soLuong - 1);

    setSoLuong(number);
  };
  console.log(cart);

  const nextNumber = () => {
    // const number = Math.min(5, soLuong + 1);
    const number = soLuong + 1;
    const fileIndex = (product, size, id) => {
      let result = -1;
      product.forEach((productCart, index) => {
        if (
          productCart.product.size === size &&
          productCart.product._id === id
        ) {
          result = index;
        }
      });
      return result;
    };
    const index = fileIndex(cart, size, product._id);
    console.log(index);
    let vt = 0;
    product.sizeQuantity.forEach((item, index) => {
      if (item.size === size) {
        vt = index;
      }
    });
    const quantityBySize = product.sizeQuantity[vt].quantity;
    if (index === -1) {
      if (number <= quantityBySize) {
        setSoLuong(number);
      } else {
        message.error(
          `Bạn đã có ${quantityBySize} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
        );
      }
    } else {
      if (cart[index].quantity + number <= quantityBySize) {
        setSoLuong(number);
      } else {
        message.error(
          `Bạn đã có ${quantityBySize} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
        );
      }
    }
  };
  const dispatch = useDispatch();

  const handleAddCart = () => {
    if (!size) {
      popup(
        "Không thể thêm vào giỏ hàng",
        "Vui lòng chọn kích cỡ sản phẩm",
        "error"
      );
    } else {
      const fileIndex = (product, size, id) => {
        let result = -1;
        product.forEach((productCart, index) => {
          if (
            productCart.product.size === size &&
            productCart.product._id === id
          ) {
            result = index;
          }
        });
        return result;
      };
      const index = fileIndex(cart, size, product._id);
      console.log(index);
      let vt = 0;
      product.sizeQuantity.forEach((item, index) => {
        if (item.size === size) {
          vt = index;
        }
      });
      const quantityBySize = product.sizeQuantity[vt].quantity;
      if (index === -1) {
        if (soLuong <= quantityBySize) {
          dispatch(
            addCart({
              product: {
                ...product,
                size,
                price: product.price - (product.price * product.discount) / 100,
              },
              quantity: soLuong,
            })
          );
          setSoLuong(1);
          message.success("Thêm vào giỏ hàng thành công");
        } else {
          message.error(
            `Bạn đã có ${quantityBySize} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
          );
        }
      } else {
        if (cart[index].quantity + soLuong <= quantityBySize) {
          dispatch(
            addCart({
              product: {
                ...product,
                size,
                price: product.price - (product.price * product.discount) / 100,
              },
              quantity: soLuong,
            })
          );
          setSoLuong(1);
          message.success("Thêm vào giỏ hàng thành công");
        } else {
          message.error(
            `Bạn đã có ${quantityBySize} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
          );
        }
      }
    }
  };
  const loadPrice = (product) => {
    const formatter = new Intl.NumberFormat("vn");
    if (product && product.isdiscount) {
      const price = product.price - (product.price * product.discount) / 100;
      return (
        <div className="price-box">
          <span className="special-price">
            <span>
              {formatter.format(price)} <u>đ</u>
            </span>
          </span>
          <span className="old-price">
            <del>{formatter.format(product.price)} đ</del>
          </span>
        </div>
      );
    } else {
      return (
        <div className="price-box">
          <span className="special-price">
            <span>
              {formatter.format(product?.price)} <u>đ</u>
            </span>
          </span>
        </div>
      );
    }
  };
  const handleChangeSize = (size) => {
    setSize(size);
    setSoLuong(1);
    let vt = 0;
    product.sizeQuantity.forEach((item, index) => {
      if (item.size === size) {
        vt = index;
      }
    });
    setTotalSum(product.sizeQuantity[vt].quantity);
  };
  return (
    <>
      <section className="inforProduct ">
        <div className="product-images ">
          <div className="product-images-detaitl">
            <Slider {...settings}>
              {product?.images.map((image, index) => (
                <div className="product-image" key={index}>
                  <Image src={image.url} alt={image._id} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="product-infor">
          <h1 className="product-name">{product?.name}</h1>
          <div className="product-content">
            <div className="product-reivew">
              {showReview(product?.ratings, product?.numOfReviews)}
            </div>
            <div className="product-status">
              <span className="first_status">
                Nhà sản xuất:
                <span className="status_name"> {product?.category}</span>
              </span>
              <span className="first_status">
                &nbsp;|&nbsp; Tình trạng:
                <span className="status_name">
                  <span> Còn hàng</span>
                </span>
              </span>
            </div>

            {loadPrice(product)}
            <div className="product-content-item">
              <div className="group-product-infor">
                Giới tính:
                <span className="group-product-text"> {product?.gender}</span>
              </div>
              <div className="group-product-infor">
                Màu sắc:
                {product?.color?.map((color) => (
                  <span key={color} className="group-product-text">
                    {color}
                  </span>
                ))}
              </div>
              <div className="group-product-infor">
                Kích cỡ:
                {product?.sizeQuantity.map((s, i) => {
                  return (
                    <div
                      aria-disabled={s.quantity <= 0}
                      className={
                        s.quantity <= 0 ? "is-disabled size-item" : "size-item"
                      }
                      key={i}
                    >
                      <span
                        onClick={
                          s.quantity > 0
                            ? () => handleChangeSize(s.size)
                            : undefined
                        }
                        className={s.size === size ? "size-item-active" : ""}
                      >
                        {s.size}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="group-product-infor">
                Số lượng:
                <div className="custom">
                  <div className="click-left" onClick={preNumber}>
                    -
                  </div>
                  <p>{soLuong}</p>

                  <div className="click-right" onClick={nextNumber}>
                    +
                  </div>
                  <div style={{ marginLeft: 8 }}>
                    {totalSum} sản phẩm có sẵn
                  </div>
                </div>
              </div>
              <div className="button_actions">
                <Button
                  icon={<ShoppingCartOutlined />}
                  className="add_to_cart"
                  onClick={handleAddCart}
                  size="large"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="group-description" data-aos="fade-down">
        <h2>MÔ TẢ SẢN PHẨM</h2>
        <div className="group-description-text">{product?.description}</div>
      </div>
    </>
  );
}
