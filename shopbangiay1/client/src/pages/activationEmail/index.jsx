import popup from "components/common/Popup";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthServices } from "services/auth-service";

const ActivationEmail = () => {
  const { activation_token } = useParams();
  console.log(activation_token);
  const authServices = new AuthServices();
  const history = useHistory();
  useEffect(() => {
    if (activation_token) {
      const activationEmail = async (req, res) => {
        try {
          const res = await authServices.activation({ activation_token });
          popup(
            "Xác thực",
            `Tài khoản đã được xác thực thành công bạn có thể quay trở lại đăng nhập`,
            "success"
          );
          history.push("/login");
        } catch (err) {
          console.log(err);
          popup("Xác thực", `${err.response.data.msg}`, "error");
        }
      };
      activationEmail();
    }
  }, [activation_token]);
  return (
    <div
      style={{
        fontSize: 24,
        color: "#4a5568",
        margin: "100px",
        textAlign: "center",
      }}
    >
      Tài khoản đã được xác thực có thể đăng nhập được
    </div>
  );
};

export default ActivationEmail;
