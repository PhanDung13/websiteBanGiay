import React from "react";
import "./style.scss";
import Banner from "./Banner";
import Trademark from "./Trademark";
import ProductsType from "./ProductsType";
import SliderHome from "./Slider";
import Chatbox from "./ChatBox";
const Homepage = () => {
  return (
    <>
      <Banner />
      <Trademark />
      <ProductsType />
      <SliderHome />
      <Chatbox />
    </>
  );
};

export default Homepage;
