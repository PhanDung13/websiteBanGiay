import { useState, useEffect } from "react";
import { Comment, Avatar, Form, Button, Input, Rate, message } from "antd";
import ImageDefault from "assets/images/avatar.png";
import { useHistory } from "react-router-dom";
import $ from "jquery";
// --CSS
import "./style.css";
import { ProductService } from "services/product-service";

export default function FormWrite({ product_id, socket, user }) {
  // create State
  const history = useHistory();
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [star, setStar] = useState(0);
  const [content, setContent] = useState("");
  const productService = new ProductService();
  //function

  const onFinish = async (values) => {
    if (star === 0) {
      message.error("Bạn chưa nhập đánh giá sao");
      return;
    }
    if (user) {
      socket.emit("createComment", {
        id_user: user._id,
        content: values.content,
        id_product: product_id,
        rating: star,
      });
      await productService.updatereview({ id: product_id, ratings: star });
      setContent("");
      setStar(0);
      $("body,html").animate(
        { scrollTop: $(".list-item-comment").offset().top - 140 },
        1500
      );
      message.success("Thêm đánh giá thành công");
    }
  };
  // useEffect(() => {
  //   if (socket) {
  //     document.getElementById("message").addEventListener("focus", () => {
  //       if (token) {
  //         socket.emit("waitWriteComment", {
  //           idProduct,
  //           message: "Ai đó đang viết bình luận...",
  //         });
  //       } else {
  //         history.push("/login");
  //       }
  //     });
  //     document.getElementById("message").addEventListener("blur", () => {
  //       socket.emit("waitWriteComment", { idProduct, message: "" });
  //     });
  //     socket.on("waitWriteComment", (msg) => {
  //       document.getElementById("waitWriteComment").innerHTML = msg;
  //     });
  //   }
  //   return () => socket.off("waitWriteComment");
  // }, [contentCmt, token]);

  const onChangeTextArea = (e) => {
    if (!user) {
      history.push("/login");
    }
    setContent(e.target.value);
  };
  const handleChange = (newRating) => {
    setStar(newRating);
  };
  // state
  const showIconImage = (image, data) => {
    let avatar = null;
    if (data) {
      avatar = data.avatar;
    } else {
      avatar = image;
    }
    return avatar;
  };

  return (
    <div className="group-form-comment">
      <Form onFinish={onFinish}>
        <Comment
          avatar={
            <Avatar src={showIconImage(ImageDefault, user)} alt="Han Solo" />
          }
        >
          <Rate onChange={handleChange} value={star} />
          <div className="group-length-content">
            <p>{content.length}/700</p>
          </div>
          <Form.Item name="content">
            <TextArea
              placeholder="Mời bạn để lại bình luận"
              rows={8}
              max={20}
              value={content}
              onChange={onChangeTextArea}
              maxLength={700}
              id="message"
              className="from-write"
            />
          </Form.Item>
          <Form.Item shouldUpdate={true}>
            <Button htmlType="submit" type="primary">
              Thêm Bình Luận
            </Button>
          </Form.Item>
        </Comment>
      </Form>
    </div>
  );
}
