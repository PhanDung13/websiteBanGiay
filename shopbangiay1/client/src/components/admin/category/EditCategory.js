import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { CategoryService } from "services/category-service";
import "./style.scss";
const EditCategory = ({ edit, setEdit, category, call, setCall }) => {
  function getBase64(file) {
    console.log("file :", file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const [previewImg, setPreviewImg] = useState();
  const categoryService = new CategoryService();
  const [image, setImage] = useState();
  const [form] = Form.useForm();
  console.log(image);
  useEffect(() => {
    setPreviewImg(category.image);
  }, []);
  const handleChangeImage = async (e) => {
    setPreviewImg(null);
    const file = e.target.files[0];
    const ImgUrl = await getBase64(file);
    setImage(ImgUrl);
    console.log(ImgUrl);
  };
  const handleAddCategory = async (values) => {
    try {
      const res = await categoryService.updateCategory({
        ...values,
        image,
        id: category._id,
      });
      setCall(!call);
      setEdit(false);
      message.success("Cập nhập thành công");
    } catch (error) {
      //   message.error(error.response.data.msg);c
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        width={1200}
        title="Thêm thương hiệu"
        visible={edit}
        onCancel={() => setEdit(false)}
        footer={[
          <Form form={form} onFinish={handleAddCategory}>
            <Button key="back" onClick={() => setEdit(false)}>
              Hủy
            </Button>
            <Button className="addProduct" type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form>,
        ]}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            ["name"]: category.name,
            ["description"]: category.description,
          }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Miêu tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
        <div className="div">
          <Row>
            <Col className="ant-col ant-col-6 ant-form-item-label" span={8}>
              <div className="label-hinhanh">Hình ảnh</div>
            </Col>
            <Col span={16}>
              <div>
                <input
                  type="file"
                  name="hinhanh"
                  onChange={handleChangeImage}
                />
                <div className="preview-cate">
                  {previewImg && <img src={previewImg} alt="" />}
                  {image && <img src={image} alt="" />}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default EditCategory;
