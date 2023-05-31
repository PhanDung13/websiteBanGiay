import React, { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import "./style.scss";
import Menu from "./header/menu/Menu";
const DefaultLayout = (props) => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <Header setOpenMenu={setOpenMenu} />
      <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <div className="ground-container">
        <div className="main-container">
          <div className="group-home">
            <div className="home">{props.children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DefaultLayout;
