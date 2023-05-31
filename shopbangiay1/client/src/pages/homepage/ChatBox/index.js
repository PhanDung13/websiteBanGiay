import { MessageOutlined } from "@ant-design/icons";
import { message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Chat from "./Chat";
import "./style.scss";
const Chatbox = () => {
  const [tonggle, setTonggle] = useState(false);
  const { isLogged } = useSelector((state) => state.auth);
  const history = useHistory();
  const handleOpenChat = () => {
    if (isLogged) {
      setTonggle(true);
    } else {
      message.info("Đăng nhập để sử dụng tính năng nhắn tin");
      history.push("/login");
    }
  };
  return (
    <div>
      <div className="Chatbox-container">
        {!tonggle && (
          <div className="float" onClick={handleOpenChat}>
            <MessageOutlined style={{ fontSize: 24 }} />
          </div>
        )}
        {tonggle && <Chat setTonggle={setTonggle} />}
      </div>
    </div>
  );
};

export default Chatbox;
