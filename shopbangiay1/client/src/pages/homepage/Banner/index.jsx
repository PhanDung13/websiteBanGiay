import Slider from "react-slick";
import anh1 from "assets/images/anh1.jpg";
import anh5 from "assets/images/anh5.jpg";
import anh2 from "assets/images/anh2.jpg";
import anh3 from "assets/images/anh3.jpg";
import "./style.scss";
export default function Banner() {
  const dataBannerResult = [
    {
      banner: anh5,
    },
    {
      banner: anh3,
    },
    {
      banner: anh2,
    },
    {
      banner: anh1,
    },
  ];
  const settings = {
    infinite: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 550,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const ShowBanner = (data) => {
    if (data.length > 0) {
      return (
        <Slider {...settings} className="list-item-banner">
          {data.map((igBanner, index) => (
            <div className="items-banner" key={index}>
              <img src={igBanner.banner} alt={igBanner._id} />
            </div>
          ))}
        </Slider>
      );
    }
  };
  return (
    <>
      <div className="ground-banner">
        <div className="list-banner">{ShowBanner(dataBannerResult)}</div>
      </div>
    </>
  );
}
