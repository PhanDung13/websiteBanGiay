import { Link } from "react-router-dom";
const formatter = new Intl.NumberFormat("vn");
export default function CartItem({ data }) {
  return (
    <div className="group-card-buy" key={data.product._id}>
      <div className="information-cart-buy">
        <div className="group-cart-img-name">
          <div className="history-cart-product-img">
            <img src={data.product.images[0].url} alt={data.product._id} />
          </div>
          <div className="history-card-name">
            <Link to={`/detail/${data.product._id}`}>
              <p>
                {data.product.name} - <span>Size: {data.product.size}</span>{" "}
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="group-card-price-quantity">
        <div className="group-card-price">
          <span>Giá</span>
          <p>
            {formatter.format(data.product.price)} <u>đ</u>
          </p>
        </div>
        <div className="group-cart-quantity">
          <span>Số lượng</span>
          <p>{data.quantity}</p>
        </div>
      </div>
    </div>
  );
}
