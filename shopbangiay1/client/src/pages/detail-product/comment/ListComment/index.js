import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { ProductService } from "services/product-service";
import CommentItem from "./CommentItem";
import "./style.scss";
export default function ListComment({ socket, user, product_id }) {
  const [page, setPage] = useState(1);
  const [dataComment, setDataComment] = useState([]);
  const [loading, setLoading] = useState(false);
  const productService = new ProductService();
  const [call, setCall] = useState(true);
  const pageEnd = useRef();

  useEffect(() => {
    setLoading(true);
    const getcomment = async () => {
      const res = await productService.getComments({
        product_id,
        page,
        limit: 3,
      });
      setDataComment(res.comments);

      setLoading(false);
    };
    getcomment();
  }, [product_id, page, call]);
  useEffect(() => {
    if (socket) {
      socket?.on("sendCommentToClient", (msg) => {
        setDataComment([msg, ...dataComment]);
      });

      return () => socket?.off("sendCommentToClient");
    }
  }, [socket, dataComment, setDataComment]);
  useEffect(() => {
    if (socket) {
      socket?.on("sendReplyCommentToClient", (msg) => {
        const newArr = [...dataComment];
        console.log("vào");
        newArr.forEach((cm) => {
          if (cm._id === msg._id) {
            cm.reply = msg.reply;
          }
        });

        setDataComment(newArr);
      });

      return () => socket?.off("sendReplyCommentToClient");
    }
  }, [socket, dataComment, setDataComment]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((pre) => pre + 1);
        }
      },
      {
        threshold: 1,
      }
    );
    observer.observe(pageEnd.current);
  }, []);
  return (
    <div className="list-item-comment">
      <p
        style={{
          color: "#4a5568",
          fontSize: "1.2rem",
          fontWeight: 550,
          margin: 0,
          paddingLeft: "10px",
        }}
      >
        KHÁCH HÀNG NHẬN XÉT
      </p>
      {dataComment?.map((item) => (
        <CommentItem
          key={item._id}
          comment={item}
          user={user}
          socket={socket}
          product_id={product_id}
          call={call}
          setCall={setCall}
        />
      ))}
      {loading && <Spin />}
      <button style={{ opacity: 0 }} ref={pageEnd}>
        load more
      </button>
    </div>
  );
}
