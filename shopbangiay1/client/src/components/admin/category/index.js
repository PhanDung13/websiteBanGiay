import { Button, Image, message, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { CategoryService } from "services/category-service";
import EditCategory from "./EditCategory";
import NewCategory from "./NewCategory";
const Category = () => {
  const [data, setData] = useState([]);
  const [category, setCatagory] = useState();
  const [edit, setEdit] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const categoryService = new CategoryService();
  const [call, setCall] = useState(false);
  const getCategory = async () => {
    const res = await categoryService.getCategory();
    setData(res);
  };
  console.log(data);
  useEffect(() => {
    getCategory();
  }, [call]);
  const handleEdit = (product) => {
    setCatagory(product);
    setEdit(true);
  };

  const confirm = async (e) => {
    console.log(e);
    try {
      const res = await categoryService.deleteCategory({ id: e._id });
      setCall(!call);
      message.success("Xóa thành công");
    } catch (error) {
      message.error(error.response.data.msg);
    }
  };

  const columns = [
    {
      title: "Thương hiệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Miêu tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hình ảnh",
      key: "image",
      dataIndex: "image",
      width: "300px",
      render: (image) => (
        <div className="product-imgs">
          <Image src={image} alt={"img"} />
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
            <a href="#">Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div className="Product-admin">
      <Button
        type="primary"
        className="addproduct"
        size="large"
        onClick={() => setIsNewCategory(true)}
      >
        <i class="fa-solid fa-plus" style={{ marginRight: "10px" }}></i>
        Thêm thương hiệu
      </Button>
      <Table columns={columns} dataSource={data && data} />
      {isNewCategory && (
        <NewCategory
          call={call}
          setCall={setCall}
          isNewCategory={isNewCategory}
          setIsNewCategory={setIsNewCategory}
        />
      )}
      {edit && (
        <EditCategory
          edit={edit}
          call={call}
          setCall={setCall}
          setEdit={setEdit}
          category={category}
        />
      )}
    </div>
  );
};

export default Category;
