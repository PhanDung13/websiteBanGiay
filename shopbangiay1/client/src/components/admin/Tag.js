import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { TweenOneGroup } from "rc-tween-one";
const Tags = ({ form, initcolor }) => {
  console.log(form);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState(() => {
    if (initcolor) return initcolor;
    else return [];
  });
  const [input, setInput] = useState();
  const inputRef = useRef();
  const handleClose = (removeTag) => {
    const tagss = tags.filter((tag) => tag !== removeTag);
    form.setFieldsValue({
      color: tagss,
    });
    setTags(tagss);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (tags.length !== 0) {
      form.setFieldsValue({
        color: tags,
      });
    }
  }, []);
  const handleInputComfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const tagss = [...tags, inputValue];
      setTags(tagss);
      form.setFieldsValue({
        color: tagss,
      });
    }
    setInputVisible(false);
  };
  const showInput = () => {
    setInputVisible(true);
    inputRef.current.focus();
  };
  const saveInputRef = (input) => {
    setInput(input);
  };

  const forMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };
  const tagChild = tags.map(forMap);

  return (
    <div>
      <div>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: "from",
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              e.target.style = "display: inline-block";
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tags.map((tag) => (
            <span key={tag} style={{ display: "inline-block" }}>
              <Tag
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleClose(tag);
                }}
              >
                {tag}
              </Tag>
            </span>
          ))}
        </TweenOneGroup>
      </div>
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputComfirm}
          onPressEnter={handleInputComfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} className="">
          <PlusOutlined /> Màu mới
        </Tag>
      )}
    </div>
  );
};

export default Tags;
