import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Modal, Upload } from "antd";
import { forIn } from "lodash";
import React, { useState } from "react";

const UploadImages = ({ form, fileList, setFileList }) => {
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPrviewTitle] = useState("");

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  // const handleChange = async (info) => {
  //   console.log(fileList);
  //   info.fileList.forEach((item) => {
  //     if (item?.status === "uploading") {
  //       setLoading({ loading: true });
  //       return;
  //     }
  //     if (item?.status === "done") {
  //       console.log(item);
  //       getBase64(item.originFileObj).then((urlImage) => {
  //         // form.setFieldsValue({
  //         //   images: [...images, urlImage],
  //         // });
  //       });
  //       console.log(FileList);
  //     }
  //     setLoading(false);
  //   });
  // };
  const request = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const handleRemove = async (file) => {
    setFileList(fileList.filter((file1) => file.name !== file1.name));
  };
  const handelaction = (file) => {
    setFileList([...fileList, file]);
  };
  console.log(fileList);
  // console.log(images);
  return (
    <div>
      <Upload
        multiple
        listType="picture-card"
        action={handelaction}
        customRequest={request}
        onRemove={handleRemove}
        fileList={fileList}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      >
        {uploadButton}
      </Upload>
    </div>
  );
};

export default UploadImages;
