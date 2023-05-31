import React from "react";
import { useSelector } from "react-redux";
import FormWrite from "./FormWrite";
import ListComment from "./ListComment";
import StarRatingUser from "./StarRatingUser";
import "./style.css";
const Comment = ({ socket, product_id }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <FormWrite user={user} socket={socket} product_id={product_id} />
      <StarRatingUser product_id={product_id} />
      <ListComment user={user} product_id={product_id} socket={socket} />
    </div>
  );
};

export default Comment;
