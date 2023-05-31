import { Select } from "antd";
import { Option } from "antd/lib/mentions";
import React from "react";

const Sorting = ({ calback, category, sort }) => {
  const onChangeSortPrice = (e) => {
    calback(e.value, category);
  };
  return (
    <Select
      labelInValue
      defaultValue={sort}
      style={{ width: 150 }}
      onChange={onChangeSortPrice}
    >
      <Option value="-createdAt">Mới nhất</Option>
      <Option value="price">Giá thấp đến cao</Option>
      <Option value="-price">Giá cao đến thấp</Option>
    </Select>
  );
};

export default Sorting;
