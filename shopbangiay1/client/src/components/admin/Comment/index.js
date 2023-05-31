import { Image, Switch, Table, Button, Input, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { ProductService } from "services/product-service";
import Highlighter from "react-highlight-words";
const Comment = () => {
  const [data, setData] = useState([]);
  const refInput = useRef();
  const producService = new ProductService();
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();
  const [call, setCall] = useState(false);

  console.log(data);
  const onChangeStatus = async (record) => {
    console.log(record._id);
    await producService.updateComment({ id: record._id });
  };
  useEffect(() => {
    const getCategory = async () => {
      let res = await producService.getAllComments();
      res = res.comments.map((item) => {
        return { ...item, key: item._id };
      });
      setData(res);
    };
    getCategory();
  }, [call]);
  console.log(data);
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={refInput}
          // ref={(node) => {
          //   this.searchInput = node;
          // }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => refInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "id_product",
      key: "id_product",
      ...getColumnSearchProps("id_product.name"),
      render: (name) => <div>{name?.name}</div>,
    },
    {
      title: "Hình ảnh",
      key: "image",
      dataIndex: "id_product",
      render: (image) => (
        <div className="product-imgs">
          <Image
            src={image?.images[0]?.url}
            alt={"img"}
            style={{ width: 100 }}
          />
        </div>
      ),
    },
    {
      title: "Người bình luận",
      dataIndex: "id_user",
      key: "id_user",
      render: (name) => <div className="product-imgs">{name.name}</div>,
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      ...getColumnSearchProps("rating"),
    },
    {
      title: "Nội dung đánh giá",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trạng thái",
      key: "action",
      render: (text, record) => {
        console.log(record);
        return (
          <Switch
            defaultChecked={record.status}
            onChange={() => onChangeStatus(record)}
          />
        );
      },
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  return (
    <div className="Comment-admin">
      <Table columns={columns} dataSource={data && data} />
    </div>
  );
};

export default Comment;
