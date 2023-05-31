import {
  Button,
  Image,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { ProductService } from "services/product-service";
import EditProduct from "./EditProduct";
import NewProduct from "./NewProduct";
import "./style.scss";
const { Search } = Input;
const Products = () => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(100000);
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState();
  const [edit, setEdit] = useState(false);
  const [call, setCall] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const productService = new ProductService();
  const formatter = new Intl.NumberFormat("vn");
  const [search, setSeach] = useState("");
  const getProduct = async () => {
    let res = await productService.getProductAdmin({
      page,
      limit,
      name: search,
    });
    console.log(res);
    const result = res?.products?.map((item) => {
      return { ...item, key: item._id };
    });
    setData(result);
  };
  useEffect(() => {
    getProduct();
  }, [limit, page, call, search]);
  const handleEdit = (product) => {
    setProduct(product);
    setEdit(true);
  };

  const confirm = async (e) => {
    console.log(e);
    try {
      await productService.deleteProduct({ id: e._id });
      setCall(!call);
      message.success("Xóa thành công");
    } catch (error) {
      message.error(error.response.data.msg);
    }
  };

  const columns = [
    {
      title: "Tên Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
        multiple: 1,
      },
      render: (price) => <div>{formatter.format(price)} đ</div>,
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeQuantity",
      key: "sizeQuantity",
      render: (sizeQuantity) =>
        sizeQuantity.map((s) => <span key={s.size}>{s.size} </span>),
    },
    {
      title: "Màu sắc",
      key: "color",
      dataIndex: "color",
      render: (color) => (
        <>
          {color.map((c) => (
            <Tag key={c} color={"green"}>
              {c.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Hình ảnh",
      key: "images",
      dataIndex: "images",
      width: "290px",
      render: (images) => (
        <div className="product-imgs">
          {images.map((c) => (
            <Image key={c.public_id} src={c.url} alt={c.public_id} />
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Sửa</a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ?"
            onConfirm={() => confirm(record)}
            okText="Xóa"
            cancelText="Hủy"
            placement="topRight"
          >
            <a>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleSearch = (e) => {
    setSeach(e.target.value);
  };
  return (
    <div className="Product-admin">
      <div className="admin-title" style={{ display: "flex" }}>
        <div>
          <Search
            placeholder="nhập tên sản phẩm cần tìm kiến"
            onChange={(e) => handleSearch(e)}
            size="large"
            value={search}
            allowClear
            enterButton
          />
        </div>
        <Button
          type="primary"
          className="addproduct"
          size="large"
          onClick={() => setIsNewProduct(true)}
        >
          <i className="fa-solid fa-plus" style={{ marginRight: "10px" }}></i>
          Thêm sản phẩm
        </Button>
      </div>

      <Table columns={columns} dataSource={data && data} />

      {isNewProduct && (
        <NewProduct
          isNewProduct={isNewProduct}
          setIsNewProduct={setIsNewProduct}
        />
      )}
      {edit && (
        <EditProduct
          edit={edit}
          call={call}
          setCall={setCall}
          setEdit={setEdit}
          product={product}
        />
      )}
    </div>
  );
};

export default Products;
