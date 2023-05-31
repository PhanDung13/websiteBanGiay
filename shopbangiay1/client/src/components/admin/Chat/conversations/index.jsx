import { Popconfirm, Space, message } from "antd";
import { useEffect, useState } from "react";
import { UserServices } from "services/user-service";
import { ConversationService } from "services/conversation-service";

import "./style.css";

export default function Conversation({
  conversation,
  highline,
  call,
  setCall,
  setCurrentChat,
  setKhachhang,
}) {
  const [user, setUser] = useState(null);
  const userService = new UserServices();
  const convers = new ConversationService();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userService.getInfor({ id: conversation.id_user });
        setUser(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation]);
  const confirm = async () => {
    try {
      await convers.deleteConversation({ id: conversation._id });
      message.success("Xóa thành công");
      setKhachhang(null);
      setCurrentChat(null);
      setCall(!call);
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  return (
    <div className={highline === true ? "conversation hig" : "conversation"}>
      <Space>
        <img className="conversationImg" src={user?.avatar} alt="" />
        <span className="conversationName">{user?.name}</span>
      </Space>
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa ?"
        onConfirm={() => confirm()}
        okText="Xóa"
        cancelText="Hủy"
        placement="topRight"
      >
        <a>Xóa</a>
      </Popconfirm>
    </div>
  );
}
