import adidas from "assets/images/adidas.png";
import converse from "assets/images/converse.jpg";
import newBalance from "assets/images/newBalance.jpg";
import nike from "assets/images/nike.jpg";
import puma from "assets/images/puma.jpg";
import { Link } from "react-router-dom";
import vans from "assets/images/vans.jpg";
import "./style.scss";
export default function Trademark() {
  return (
    <div className="group-trademark">
      <h3>THƯƠNG HIỆU</h3>
      <div className="container-trademark">
        <ul>
          <li>
            <Link to="/product?trademark=adidas">
              <img src={adidas} alt="adidas" />
            </Link>
          </li>
          <li>
            <Link to="/product?trademark=converse">
              <img src={converse} alt="converse" />
            </Link>
          </li>
          <li>
            <Link to="/product?trademark=newBalance">
              <img src={newBalance} alt="newBalance" />
            </Link>
          </li>
          <li>
            <Link to="/product?trademark=nike">
              <img src={nike} alt="nike" />
            </Link>
          </li>
          <li>
            <Link to="/product?trademark=puma">
              <img src={puma} alt="puma" />
            </Link>
          </li>
          <li>
            <Link to="/product?trademark=vans">
              <img src={vans} alt="vans" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
