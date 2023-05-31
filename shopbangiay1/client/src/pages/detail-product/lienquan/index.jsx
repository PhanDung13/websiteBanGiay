import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "./style.scss";
import { ProductService } from "services/product-service";
import { Rate } from "antd";
import Loading from "pages/LoadingPage";
function Lienquan({ product }) {
  const products = new ProductService();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(product);
  useEffect(() => {
    setLoading(true);
    if (product) {
      const getProduct = async () => {
        let res = await products.getLienquan({
          limit: 12,
          category: product.category,
        });
        res = res.products.filter((item) => {
          return item._id !== product._id;
        });
        setData(res);
        setLoading(false);
      };
      getProduct();
    }
  }, [product]);
  const formatter = new Intl.NumberFormat("vn");
  const showReview = (rating, numReviews) => {
    const rate = rating / numReviews;
    if (numReviews > 0) {
      return (
        <>
          <Rate value={rate} disabled />
          <p>{numReviews} Đánh giá</p>
        </>
      );
    } else {
      return (
        <>
          <Rate value={5} disabled />
          <p> Chưa có đánh giá</p>
        </>
      );
    }
  };
  const ShowProducts = () => {
    if (data.length > 0) {
      return (
        <div className="products-type">
          {data.map((product) => (
            <div
              className="item-products-type"
              key={product._id}
              data-aos="zoom-in"
            >
              <Link to={`/detail/${product._id}`}>
                <div className="ig-products-type">
                  <LazyLoadImage
                    effect="blur"
                    src={product?.images[0]?.url}
                    alt={product?._id}
                    key={product?._id}
                    height="100%"
                    width="100%"
                  />{" "}
                </div>
                <div className="name-products-type">
                  <p>{product?.name}</p>
                </div>
              </Link>
              <div className="price-products-type">
                <div className="group-price">
                  <span>
                    {formatter.format(
                      product.price - (product.price * product.discount) / 100
                    )}{" "}
                    <u>đ</u>
                  </span>
                </div>
              </div>
              <div className="group-start-review">
                {showReview(product.ratings, product.numOfReviews)}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  return (
    <>
      <div className="group-products-type">
        <h3> CÓ THỂ BẠN CŨNG THÍCH</h3>
        {loading && <Loading />}
        {!loading && ShowProducts()}
      </div>
    </>
  );
}
export default React.memo(Lienquan);
