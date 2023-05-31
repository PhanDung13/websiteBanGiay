import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
// Component
import Loading from "pages/LoadingPage";
// CSS
import settings from "./style";
import "./style.css";
import { ProductService } from "services/product-service";
import { Rate } from "antd";
function SliderHome() {
  const products = new ProductService();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    const getProduct = async () => {
      const res = await products.getSaleProducts({ limit: 100 });
      setData(res.products);
      setLoading(false);
    };
    getProduct();
  }, []);
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
  const ShowSlider = () => {
    if (data?.length > 0) {
      return (
        <Slider {...settings}>
          {data.map((slider) => (
            <div className="iteml-silder" key={slider._id} data-aos="zoom-in">
              <Link to={`/detail/${slider._id}`}>
                <div className="ig-silder">
                  <LazyLoadImage
                    effect="blur"
                    src={slider.images[0].url}
                    alt={slider._id}
                    key={slider._id}
                    height="100%"
                    width="100%"
                  />
                </div>
                <div className="name-silder">
                  <p>{slider.name}</p>
                </div>
                <div className="price-sidler">
                  <span>
                    {formatter.format(
                      slider.price - (slider.price * slider.discount) / 100
                    )}{" "}
                    <u>đ</u>
                  </span>
                  <div style={{ textAlign: "center" }}>
                    <del style={{ color: "#888" }}>
                      {" "}
                      {formatter.format(slider.price)}
                      <u>đ</u>
                    </del>
                  </div>
                </div>
                <div className="group-start-review">
                  {showReview(slider.ratings, slider.numOfReviews)}
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      );
    }
  };
  return (
    <>
      <div className="group-silder">
        <h3>KHUYẾN MÃI HOT NHẤT</h3>
        <div className="silder">
          {loading && <Loading />}
          {!loading && ShowSlider()}
        </div>
      </div>
    </>
  );
}
export default SliderHome;
