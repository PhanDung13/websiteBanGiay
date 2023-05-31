import { AlignLeftOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import Cart from "./cart/Cart";
import User from "./inforUser/User";
import Search from "./search/Search";
import "./style.scss";
import logo from "assets/images/logo.png"
const Header = ({ setOpenMenu }) => {
  return (
    <>
      <div className="ground-header">
        <div className="main-header">
          <div className="main-item-logo">
            <Link to="/">
              <img src={logo} alt="This logo"/>
                {/* <div className="logo2">
                  DShop
                </div> */}
            </Link>
          </div>
          <Search />
          <div className="toggle-menu">
            <AlignLeftOutlined
              onClick={() => setOpenMenu(true)}
              style={{
                fontSize: "1.2em",
                color: "white",
              }}
            />
          </div>
          <Cart />
          <User />
        </div>
      </div>
    </>
  );
};

export default Header;
