import { message, Modal, Rate, Tooltip } from "antd";
import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ProductService } from "services/product-service";
moment.locale("vi");
const CommentCard = ({ call, setCall, comment, children, type }) => {
  const { user } = useSelector((state) => state.auth);
  const productService = new ProductService();
  console.log(user);
  const avatarLogo =
    "https://res.cloudinary.com/phuockaito/image/upload/v1618158354/tich-xanh-fanpage-va-quang-cao-livestream-fanpage-tich-xanh_ttn2e7.png";
  const deleteComment = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn xóa đánh giá này không ?.",
      icon: <ExclamationCircleOutlined />,
      width: 500,
      okText: "tiếp tục",
      cancelText: "hủy",
      onOk() {
        const deleteuser = async () => {
          await productService.deleteComment({ id_comment: comment?._id });
          console.log(user._id);
          setCall(!call);
          message.success("Xóa thành công!");
        };
        deleteuser();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <div>
      <div className="item-comment">
        <div className="avatar-author">
          <img src={comment?.id_user?.avatar} alt="" />
        </div>
        <div className="content-author">
          <div className="ground-content-name-start">
            <div className="main-item-comment">
              <div className="group-avatar-logo-name">
                <h3 className={comment?.role === 1 && "admin"}>
                  {comment?.id_user?.name}
                  {comment?.id_user?.role === 1 && (
                    <img src={avatarLogo} alt={comment?.name} />
                  )}
                </h3>
                {comment?.id_user?.role === 1 && <p>Quản trị viên</p>}
                {(user?.role === 1 || comment?.id_user?._id === user?._id) &&
                  type !== "reply" && (
                    <i
                      onClick={deleteComment}
                      className="fa-solid fa-x delete-comment"
                    ></i>
                  )}
              </div>
              <div className="time-content">
                <Tooltip
                  placement="topLeft"
                  title={moment(comment?.createdAt).format("LLLL")}
                >
                  <span>{moment(comment?.createdAt).fromNow()}</span>
                </Tooltip>
                {comment?.editComment && (
                  <span className="edit">(đã chỉnh sửa)</span>
                )}
              </div>
              <div className="group-start">
                {comment?.rating > 0 && (
                  <Rate disabled value={comment?.rating} />
                )}
              </div>
              <div className="ground-content">
                <p> {comment?.content}</p>
              </div>
              <div className="ground-reply">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
