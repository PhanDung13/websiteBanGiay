import { CameraOutlined } from "@ant-design/icons";
import { Button, Image, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import Popup from "components/common/Popup";
import React, { useState } from "react";
import { UserServices } from "services/user-service";
const UploadImage = ({ avatar, name, callBackAvatar }) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const userServices = new UserServices();
  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = function () {
        return resolve({
          data: fileReader.result,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      };
      fileReader.readAsDataURL(file);
    });
  }
  const beforeUpload = async (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      Popup("Tải ảnh", "Bạn chỉ có thể tải lên tệp JPG / PNG / JPEG!", "error");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Popup("Tải ảnh", "Hình ảnh phải nhỏ hơn 2MB !", "error");
    }
    if (isLt2M && isJpgOrPng) {
      const { data } = await readAsDataURL(file);
      // console.log(ImageUrl);
      setImage(data);
      setLoading(true);
      const getUrl = async () => {
        const res = await userServices.uploadAvatar({ avatar: data });
        await userServices.updateUser({ name, avatar: res.url });
        setLoading(false);
      };
      getUrl();
    }
    return isJpgOrPng && isLt2M;
  };
  const urlavatar = () => {
    if (image) return image;
    else if (avatar) return avatar;
    else return "https://picsum.photos/seed/picsum/200/300";
  };

  return (
    <div className="group-avatar">
      <Image src={urlavatar()} />
      <div className="group-upload-image">
        <ImgCrop
          modalOk="Cập Nhật"
          modalCancel="Hủy"
          rotate
          modalTitle="Cập ảnh đại diện"
        >
          <Upload
            beforeUpload={beforeUpload}
            fileList={[]}
            name="avatar"
            accept=".jpg, .jpeg, .png"
            listType="listTyp"
          >
            <Button icon={<CameraOutlined />} type="dashed" loading={loading}>
              Tải ảnh lên
            </Button>
          </Upload>
        </ImgCrop>
      </div>
    </div>
  );
};

export default UploadImage;
