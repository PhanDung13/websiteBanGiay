import { Result } from "antd";
import { Link } from "react-router-dom";
import "./style.css";
export default function NotFount() {
  return (
    <div className="group-notFount">
      <div className="NotFount">
        <Result
          status="404"
          title="404"
          subTitle="Xin lỗi, trang bạn đã truy cập không tồn tại."
        />
        <Link to="/">Về trang chủ</Link>
      </div>
    </div>
  );
}
