import { notification } from "antd";

const popup = (message, description, type) => {
  notification[type]({
    message: message,
    description: description,
  });
};

export default popup;
