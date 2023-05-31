import "./style.css";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");
export default function Message({ message, own, khachhang }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageBottom">
        {moment(message.createdAt).format("LT")}
      </div>
      <div className="messageTop">
        <img
          className={own ? "noneImg" : "messageImg"}
          src={khachhang?.avatar}
          alt="img"
        />
        <p className="messageText">{message.text}</p>
      </div>
    </div>
  );
}
