import "./style.css";
import { useContext, useEffect, useRef, useState } from "react";
import Message from "./message";
import Conversation from "./conversations";
import { useSelector } from "react-redux";
import { DataContext } from "DataProvider";
import { ConversationService } from "services/conversation-service";
import { MessagesService } from "services/message-Service";
import { UserServices } from "services/user-service";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [call, setCall] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const userService = new UserServices();
  const [khachhang, setKhachhang] = useState();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useContext(DataContext);
  console.log(socket);
  const scrollRef = useRef();
  const conversationService = new ConversationService();
  const messagesService = new MessagesService();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userService.getInfor({ id: currentChat.id_user });
        setKhachhang(res);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getUser();
    }
  }, [currentChat]);
  useEffect(() => {
    socket?.on("toAdmin", (data) => {
      console.log(data.senderId);
      console.log(khachhang);
      if (data.senderId === khachhang._id) {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      }
    });
    return () => socket?.off("toAdmin");
  }, [socket, khachhang]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket?.emit("addUser", user._id);
  }, [socket, user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await conversationService.getAllConversation();
        setConversations(res);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [call]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await messagesService.getMessages({ id: currentChat?._id });
        setMessages(res);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") {
      return;
    }
    const message = {
      sender: "admin",
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.id_user;
    console.log(receiverId);
    socket?.emit("sendMessage", {
      senderId: "admin",
      receiverId: receiverId,
      text: newMessage,
    });

    try {
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
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="search-chat">
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
              />
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            {conversations?.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                {console.log({ c, currentChat })}
                <Conversation
                  call={call}
                  setCall={setCall}
                  conversation={c}
                  highline={c?._id === currentChat?._id}
                  currentUser={user}
                  setCurrentChat={setCurrentChat}
                  setKhachhang={setKhachhang}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="title">
            {khachhang ? khachhang.name : "Hỗ trợ khách hàng"}
          </div>
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages?.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === "admin"}
                        khachhang={khachhang}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <input
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></input>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Gửi
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Mở một cuộc hội thoại để thực hiện chát
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
