import Slider from "react-slick";

const bannerImages = [
  "https://cdn.tgdd.vn/Products/Images/44/331568/Slider/vi-vn-macbook-pro-14-inch-m4-pro-24gb-512gb-slider-1.jpg",
  "https://cdn.tgdd.vn/Products/Images/44/331568/Slider/vi-vn-macbook-pro-14-inch-m4-pro-24gb-512gb-slider-2.jpg",
  "https://cdn.tgdd.vn/Products/Images/44/331568/Slider/vi-vn-macbook-pro-14-inch-m4-pro-24gb-512gb-slider-3.jpg",
  "https://cdn.tgdd.vn/Products/Images/44/331568/Slider/vi-vn-macbook-pro-14-inch-m4-pro-24gb-512gb-slider-4.jpg",
  "https://cdn.tgdd.vn/Products/Images/44/331568/Slider/vi-vn-macbook-pro-14-inch-m4-pro-24gb-512gb-slider-7.jpg",
  "https://cdn.tgdd.vn/Products/Images/44/331568/Slider/vi-vn-macbook-pro-14-inch-m4-pro-24gb-512gb-slider-5.jpg",
];

export default function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-4">
      <Slider {...settings}>
        {bannerImages.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`banner-${index}`}
              className="w-full h-[300px] object-cover rounded-xl shadow-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
