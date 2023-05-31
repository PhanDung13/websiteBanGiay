import { useState } from "react";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
// --ComPonent
import InforUser from "../inforUser";
// --CSS
import "./User.scss";
import { useSelector } from "react-redux";
export default function User() {
  const [openUser, setOpenUser] = useState(false);
  const user = useSelector((state) => state.auth);
  const { isLogged } = user;
  const closeOpenUser = () => {
    setOpenUser(false);
  };
  {
    openUser
      ? document.querySelector("body").classList.add("active")
      : document.querySelector("body").classList.remove("active");
  }

  return (
    <>
      <div className="ground-user">
        {!isLogged && (
          <Link to="/login" className="items-login">
            đăng nhập
          </Link>
        )}
        <div className="main-user">
          <div className="profile-login">
            {/* hiện thông tin user nếu có token */}
            {isLogged ? (
              <InforUser />
            ) : (
              <>
                {/* không có token */}
                <UserOutlined
                  style={{ fontSize: "1.2em", color: "#ffff" }}
                  onClick={() => setOpenUser(true)}
                />
                <div className={`show-login ${openUser && "open"}`}>
                  <Link to="/login" onClick={closeOpenUser}>
                    đăng nhập
                  </Link>
                  <Link to="/register" onClick={closeOpenUser}>
                    đăng ký
                  </Link>
                </div>
                {openUser && (
                  <div className="active-before" onClick={closeOpenUser}></div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
