import { Progress, Rate } from "antd";
import { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { ProductService } from "services/product-service";

import "./style.css";
export default function StarRatingUser({ product_id }) {
  const productService = new ProductService();
  const [data, setData] = useState();
  useEffect(() => {
    const getStarq = async () => {
      const res = await productService.getStarComments({
        id_product: product_id,
      });
      setData(res.msg);
    };
    getStarq();
  }, []);
  return (
    <>
      {data?.sum !== 0 && (
        <div className="ground-start-rating">
          <div className="main-start-rating">
            <div className="start-rating">
              <h3>Đánh Giá Trung Bình</h3>
              <p>{data?.tb}/5</p>
              <StarRatings
                numberOfStars={data?.tb}
                name="start"
                starDimension="18px"
                starRatedColor="#fed330"
                starHoverColor="#fed330"
                starEmptyColor="#fed330"
              />
            </div>
            <div className="control-start-rating">
              <div className="items-start-rating">
                <div className="control-start">
                  <p>{1}</p>
                  <StarRatings
                    numberOfStars={1}
                    name="start"
                    starDimension="18px"
                    starRatedColor="#fed330"
                    starHoverColor="#fed330"
                    starEmptyColor="#fed330"
                  />
                </div>
                <Progress
                  percent={((data?.oneStars / data?.sum) * 100).toFixed(1)}
                  size="small"
                  strokeColor={{
                    from: "#f25800",
                    to: "#ff7d26",
                  }}
                  status="active"
                />
                <p>
                  <span>{data?.oneStars}</span> đánh giá
                </p>
              </div>
              <div className="items-start-rating">
                <div className="control-start">
                  <p>2</p>
                  <StarRatings
                    numberOfStars={1}
                    name="start"
                    starDimension="18px"
                    starRatedColor="#fed330"
                    starHoverColor="#fed330"
                    starEmptyColor="#fed330"
                  />
                </div>
                <Progress
                  percent={((data?.twoStars / data?.sum) * 100).toFixed(1)}
                  size="small"
                  strokeColor={{
                    from: "#f25800",
                    to: "#ff7d26",
                  }}
                  status="active"
                />
                <p>
                  <span>{data?.twoStars} </span> đánh giá
                </p>
              </div>
              <div className="items-start-rating">
                <div className="control-start">
                  <p>3</p>
                  <StarRatings
                    numberOfStars={1}
                    name="start"
                    starDimension="18px"
                    starRatedColor="#fed330"
                    starHoverColor="#fed330"
                    starEmptyColor="#fed330"
                  />
                </div>
                <Progress
                  percent={((data?.threeStars / data?.sum) * 100).toFixed(1)}
                  size="small"
                  strokeColor={{
                    from: "#f25800",
                    to: "#ff7d26",
                  }}
                  status="active"
                />
                <p>
                  <span>{data?.threeStars}</span> đánh giá
                </p>
              </div>
              <div className="items-start-rating">
                <div className="control-start">
                  <p>4</p>
                  <StarRatings
                    numberOfStars={1}
                    name="start"
                    starDimension="18px"
                    starRatedColor="#fed330"
                    starHoverColor="#fed330"
                    starEmptyColor="#fed330"
                  />
                </div>
                <Progress
                  percent={((data?.fourStars / data?.sum) * 100).toFixed(1)}
                  size="small"
                  strokeColor={{
                    from: "#f25800",
                    to: "#ff7d26",
                  }}
                  status="active"
                />
                <p>
                  <span>{data?.fourStars}</span> đánh giá
                </p>
              </div>
              <div className="items-start-rating">
                <div className="control-start">
                  <p>5</p>
                  <StarRatings
                    numberOfStars={1}
                    name="start"
                    starDimension="18px"
                    starRatedColor="#fed330"
                    starHoverColor="#fed330"
                    starEmptyColor="#fed330"
                  />
                </div>
                <Progress
                  percent={((data?.fiveStart / data?.sum) * 100).toFixed(1)}
                  size="small"
                  strokeColor={{
                    from: "#f25800",
                    to: "#ff7d26",
                  }}
                  status="active"
                />
                <p>
                  <span>{data?.fiveStart}</span> đánh giá
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
