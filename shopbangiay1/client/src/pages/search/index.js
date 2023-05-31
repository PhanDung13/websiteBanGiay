import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ProductService } from "services/product-service";
import { Rate } from "antd";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Loading1 from "pages/loading";
function ProductsType() {
  const products = new ProductService();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const key = new URLSearchParams(search).get("query");
  console.log(key);
  useEffect(() => {
    setLoading(true);
    const getProduct = async () => {
      const res = await products.searchProducts({ limit: 100, name: key });
      setData(res.products);
      setLoading(false);
    };
    getProduct();
  }, [search]);
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
                    {formatter.format(product?.price)} <u>đ</u>{" "}
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
      <div className="group-products-type" style={{ minHeight: "500px" }}>
        {data.length > 0 ? (
          <h3>
            Có {data.length} kết quả tìm kiếm cho '{key}'
          </h3>
        ) : (
          <h3>Không tìm thấy kết quả cho '{key}'</h3>
        )}

        {loading && <Loading1 />}
        {!loading && ShowProducts()}
      </div>
    </>
  );
}
export default React.memo(ProductsType);
