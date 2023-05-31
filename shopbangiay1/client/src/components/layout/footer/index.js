import { UserOutlined, EyeOutlined } from "@ant-design/icons";

import cash from "assets/images/cash.jpg";
import installment from "assets/images/installment.jpg";
import internet_banking from "assets/images/internet_banking.jpg";
import jcb from "assets/images/jcb.jpg";
import mastercard from "assets/images/mastercard.jpg";
import visa from "assets/images/visa.jpg";
import "./style.scss";
export default function Footer() {
  return (
    <>
      <div className="frames-group-footer">
        <div className="group-footer">
          <div className="footer">
            <div className="group-information-user">
              <h3>HỖ TRỢ KHÁCH HÀNG</h3>
              <ul>
                <li>Các câu hỏi thường gặp</li>
                <li>Gửi yêu cầu hỗ trợ</li>
                <li>Hướng dẫn đặt hàng</li>
                <li>Phương thức vận chuyển</li>
                <li>Chính sách đổi trả</li>
                <li>Hướng dẫn mua trả góp</li>
              </ul>
            </div>
            <div className="group-information-website">
              <h3>VỀ SHOP</h3>
              <ul>
                <li>Giới thiệu</li>
                <li>Tuyển Dụng</li>
                <li>Chính sách bảo mật thanh toán</li>
                <li>Chính sách bảo mật thông tin cá nhân</li>
                <li>Chính sách giải quyết khiếu nại</li>
                <li>Điều khoản sử dụng</li>
              </ul>
            </div>
            <div className="group-payment">
              <h3>PHƯƠNG THỨC THANH TOÁN</h3>
              <ul>
                <li>
                  <img src={cash} alt="cash" />
                </li>
                <li>
                  <img src={installment} alt="installment" />
                </li>
                <li>
                  <img src={internet_banking} alt="internet_banking" />
                </li>
                <li>
                  <img src={jcb} alt="jcb" />
                </li>
                <li>
                  <img src={mastercard} alt="mastercard" />
                </li>
                <li>
                  <img src={visa} alt="visa" />
                </li>
              </ul>
            </div>
            <div className="group-connect-us">
              <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
              <ul>
                <li>
                  <a href="/" target="_blank" rel="noreferrer noopener">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="/" target="_blank" rel="noreferrer noopener">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a href="/" target="_blank" rel="noreferrer noopener">
                    <i className="fa-brands fa-github"></i>
                  </a>
                </li>
                <li>
                  <a href="/" target="_blank" rel="noreferrer noopener">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
