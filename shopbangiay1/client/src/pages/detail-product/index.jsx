import { Breadcrumb } from "antd";
import { DataContext } from "DataProvider";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductService } from "services/product-service";
import { Link } from "react-router-dom";
import Comment from "./comment";
import InForProduct from "./InforProduct";
import Loading1 from "pages/loading";
import Loading from "pages/LoadingPage";
import Lienquan from "./lienquan";

const DetailProduct = () => {
  const [product, setProduct] = useState();

  const { socket } = useContext(DataContext);
  const { id } = useParams();
  const productService = new ProductService();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", id);
    }
  }, [socket, id]);
  useEffect(() => {
    setLoading(true);
    const getProduct = async () => {
      const res = await productService.getProductById({ id: id });
      setProduct(res.product);
    };
    getProduct();
    setLoading(false);
  }, [id]);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link
            style={{
              display: "inline-block",
              padding: "15px 10px",
              color: "rgb(74, 85, 104)",
              textTransform: "capitalize",
              lineHeight: "16px",
              fontWeight: 500,
            }}
            to="/"
          >
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            style={{
              display: "inline-block",
              padding: "15px 10px",
              color: "rgb(74, 85, 104)",
              textTransform: "capitalize",
              lineHeight: "16px",
              fontWeight: 500,
            }}
            to={`/product-type/?catagory=${product?.category}`}
          >
            {product?.category}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item
          style={{
            display: "inline-block",
            padding: "15px 10px",
            color: "rgb(236, 24, 57)",
            textTransform: "capitalize",
            lineHeight: "16px",
            fontWeight: 500,
          }}
        >
          {product?.name}
        </Breadcrumb.Item>
      </Breadcrumb>
      {loading ? (
        <Loading1 />
      ) : (
        <>
          <InForProduct product={product} />
          <Comment socket={socket} product_id={id} />
          <Lienquan product={product} />
        </>
      )}
    </div>
  );
};

export default DetailProduct;
