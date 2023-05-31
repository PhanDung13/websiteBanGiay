import {
  AntDesignOutlined,
  CommentOutlined,
  HomeOutlined,
  LogoutOutlined,
  MessageOutlined,
  QqOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { LOCAL_STORAGE } from "constants/localstorage";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logOut } from "redux/authSlice";
import "./style.css";
const LayoutAdmin = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.auth);
  const onLogout = () => {
    dispatch(logOut());
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    history.push("/");
  };
  useEffect(() => {
    const body = document.querySelector("body");
    const sidebar = body.querySelector("nav");
    const toggle = body.querySelector(".toggle");

    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
  }, []);

  return (
    <div>
      <nav className="sidebar1">
        <header style={{ backgroundColor: "#7571f9", height: 70 }}>
          <div className="image-text">
            <div className="">
              <div className="logo-name">
                <a href="/admin/dashboard" className="logo_name">
                  DShop
                </a>
              </div>
            </div>
          </div>
        </header>
        <div className="menu-bar2">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link">
                <Link to="/admin/dashboard">
                  <HomeOutlined className="icon" />
                  <span className="text nav-text">Thống kê</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/admin/product">
                  <i className="bx bx-bar-chart-alt-2 icon"></i>
                  <span className="text nav-text">Sản phẩm</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/admin/category">
                  <AntDesignOutlined className="icon" />
                  <span className="text nav-text">Thương hiệu</span>
                </Link>
              </li>

              <li className="nav-link">
                <Link to="/admin/user">
                  <UserOutlined className="icon" />
                  <span className="text nav-text">Quản lý tài khoản</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/admin/comments">
                  <CommentOutlined className="icon" />
                  <span className="text nav-text">Quản lý đánh giá</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/admin/order">
                  <ShoppingCartOutlined className="icon" />
                  <span className="text nav-text">Quản lý đơn hàng</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/admin/chat">
                  <MessageOutlined className="icon" />
                  <span className="text nav-text">Hỗ trợ khách hàng</span>
                </Link>
              </li>
              <li className="nav-link">
                <LogoutOutlined className="icon" />
                <span
                  className="text nav-text"
                  style={{ cursor: "pointer" }}
                  onClick={onLogout}
                >
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="home3">
        <div className="hom3-header">
          <i className="fa-solid fa-bars toggle"></i>
          <Avatar className="avatar1" src={user?.avatar} size={40} />
        </div>
        <div className="text">{children}</div>
      </section>
    </div>
  );
};

export default LayoutAdmin;
