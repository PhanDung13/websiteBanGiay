import { useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Button, Input } from "antd";
import "./style.scss";
export default function Search() {
  const history = useHistory();
  const [isFormValid, setIsFormValid] = useState(true);
  const [openSearch, setOpenSearch] = useState(false);
  const onChangeKeyWord = (e) => {
    if (e.target.value.trim() === "") {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const submitSearch = (e) => {
    if (e) {
      const search = e.keyWord.trim().replace(/ /g, "-");
      const url = `/search?query=${search}`;
      history.push(url);
    }
  };
  {
    openSearch
      ? document.querySelector("body").classList.add("active")
      : document.querySelector("body").classList.remove("active");
  }
  return (
    <div className="ground-search">
      <SearchOutlined
        style={{ color: "white", fontSize: "1.2em" }}
        onClick={() => setOpenSearch(true)}
      />
      <div className={`search ${openSearch && "open"}`}>
        <Form onFinish={submitSearch}>
          <div className="input-search">
            <Form.Item name="keyWord">
              <Input
                // ref={refContainer}
                className="keyword-search"
                onChange={onChangeKeyWord}
                placeholder="Tìm sản phẩm, danh mục hay thương hiệu mong muốn ..."
              />
            </Form.Item>
          </div>
          <div className="icon-search">
            <Button
              htmlType="submit"
              type="primary"
              disabled={isFormValid}
              className="btn-search"
              onClick={() => setOpenSearch(false)}
            >
              <SearchOutlined
                style={{ color: "white", fontSize: "1.2em", display: "block" }}
                onClick={() => setOpenSearch(false)}
              />
            </Button>
          </div>
        </Form>
      </div>
      {openSearch && (
        <div onClick={() => setOpenSearch(false)} className="active-before" />
      )}
    </div>
  );
}
