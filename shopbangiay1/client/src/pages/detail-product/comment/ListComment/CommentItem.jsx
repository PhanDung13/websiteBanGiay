import { MessageOutlined } from "@ant-design/icons";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FormInput from "../formInput/FormInput";
import CommentCard from "./CommentCard";
import "./commentCard.scss";
let showComments = [];
const CommentItem = ({ call, setCall, comment, user, socket }) => {
  const [reply, setReply] = useState(false);
  const [name, setName] = useState("");
  const [replyComment, setReplyComment] = useState([]);
  const [hideReplyComment, setHideReplyComment] = useState([]);
  const [next, setNext] = useState(3);

  const loadMore = () => {
    setNext(next + 3);
  };
  useEffect(() => {
    const loopWithSlice = () => {
      let start =
        comment.reply.length - next < 0 ? 0 : comment.reply.length - next;

      showComments = comment.reply.slice(start, comment.reply.length);

      setHideReplyComment(start);
      setReplyComment(showComments);
    };

    loopWithSlice(next);
  }, [comment.reply, next]);
  const history = useHistory();
  const handleReply = (username) => {
    if (user) {
      setReply(true);
      setName(username);
    } else {
      message.error("Vui lòng đăng nhập để sử dụng chức năng này");
      history.push("/login");
    }
  };

  const hideReply = () => {
    setReply(false);
  };
  return (
    <div>
      <CommentCard call={call} setCall={setCall} type="ok" comment={comment}>
        <div className="nav_comment">
          <p
            className="ground-reply"
            onClick={() => handleReply(comment.id_user.name)}
          >
            {" "}
            <MessageOutlined />
            Trả lời
          </p>
          {hideReplyComment > 0 && (
            <p onClick={loadMore}> Hiển thị thêm {hideReplyComment} comments</p>
          )}
        </div>
        <div className="reply_comment">
          {replyComment.map((rep) => (
            <div key={rep._id} className="repply-group1">
              <CommentCard comment={rep} type="reply" user={rep.id_user}>
                <div className="nav_comment">
                  <p
                    className="ground-reply"
                    onClick={() => handleReply(comment.id_user.name)}
                  >
                    {" "}
                    <MessageOutlined />
                    Trả lời
                  </p>
                </div>
              </CommentCard>
            </div>
          ))}
        </div>

        {reply && (
          <FormInput
            id={comment._id}
            socket={socket}
            name={name}
            setReply={setReply}
            send="replyComment"
            user={user}
            comment={comment}
          />
        )}
      </CommentCard>
    </div>
  );
};

export default CommentItem;
