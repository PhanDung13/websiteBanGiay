import { Button, Space } from "antd";
import React, { useRef, useEffect } from "react";
import "./FormInput.css";

function FormInput({
  id,
  socket,
  rating,
  setReply,
  send,
  name,
  user,
  comment,
}) {
  const nameRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (name) {
      //   contentRef.current.innerHTML = `
      //             <a href="#!"
      //                 style="color: crimson;
      //                 font-weight: 600;
      //                 text-transform: capitalize;"
      //             >${name}: </a>
      //         `;
      contentRef.current.focus();
    }
  }, [name]);

  const commentSubmit = () => {
    if (user) {
      const content = contentRef.current.innerHTML;
      const createdAt = new Date().toISOString();
      socket.emit("createComment", {
        id_user: user._id,
        content,
        id_product: id,
        createdAt,
        rating,
        send,
        _id: comment._id,
      });
    }

    // if(rating && rating !== 0){
    //     patchData(`/api/products/${id}`, {rating})
    // }

    contentRef.current.innerHTML = "";

    if (setReply) setReply(false);
  };

  return (
    <div className="form_input">
      <p>Mời bạn để lại bình luận</p>
      <div
        ref={contentRef}
        contentEditable="true"
        style={{
          height: "100px",
          border: "1px solid #ccc",
          padding: "5px 10px",
          outline: "none",
        }}
      />
      <div className="gui-action">
        <Space size={16}>
          <Button type="primary" onClick={commentSubmit}>
            Gửi
          </Button>
          <Button type="primary" onClick={() => setReply(false)}>
            Hủy
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default FormInput;
