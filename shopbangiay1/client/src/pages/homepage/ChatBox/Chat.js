import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { DataContext } from "DataProvider";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ConversationService } from "services/conversation-service";
import { MessagesService } from "services/message-Service";
import "./Chat.scss";
import Message from "./message";
const Chat = ({ setTonggle }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversations, setConversations] = useState();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useContext(DataContext);
  console.log(socket);
  const scrollRef = useRef();
  const conversationService = new ConversationService();
  const messagesService = new MessagesService();
  useEffect(() => {
    socket?.on("getMessage", (data) => {
      console.log(data);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    return () => socket?.off("getMessage");
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket?.emit("addUser", user?._id);
  }, [socket, user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await conversationService.getConversationbyID({
          id: user?._id,
        });
        console.log(res);
        setConversations(res);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user]);
  console.log(conversations);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await messagesService.getMessages({
          id: conversations?._id,
        });
        setMessages(res);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [conversations]);
  console.log(messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") {
      return;
    }
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: conversations._id,
    };
    console.log(user);
    socket?.emit("sendMessage", {
      senderId: user?._id,
      receiverId: "admin",
      text: newMessage,
    });

    try {
      console.log(message);
      const res = await messagesService.newMessage(message);
      setMessages([...messages, res]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div>
      <div className="Chatbox">
        <div className="chatbox-title">
          <div>Hỗ trợ</div>
          <i
            className="fa-solid fa-xmark"
            onClick={() => setTonggle(false)}
          ></i>
        </div>

        {
          <>
            <div className="chattop">
              {messages?.map((m) => (
                <div ref={scrollRef}>
                  <Message
                    message={m}
                    own={m.sender === user?._id}
                    user={user}
                  />
                </div>
              ))}
            </div>
            <div className="chatBox2">
              <TextArea
                placeholder="enter..."
                autoSize
                style={{ height: "20px", focus: "none" }}
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
              <button className="button-send" onClick={handleSubmit}>
                <SendOutlined
                  style={{ fontSize: "20px", color: "rgb(76, 35, 198)" }}
                />
              </button>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default Chat;
