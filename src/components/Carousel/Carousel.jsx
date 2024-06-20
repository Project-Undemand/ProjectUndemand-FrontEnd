import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Carousel.css";
import { EffectCoverflow, Navigation } from "swiper/modules";

const Carousel = () => {
  const [loading, setLoading] = useState(true);
  const skeletonSlides = Array.from({ length: 5 });
  const [carouselProducts, setCarouselProducts] = useState([]);
  const memoizedRankingData = useMemo(
    () => carouselProducts,
    [carouselProducts]
  );
  const navigate = useNavigate();

  const getCarouselProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/products/ranking`,
        {
          params: {
            limit: 5,
          },
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      setCarouselProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCarouselProducts();
  }, []);

  useEffect(() => {
    if (memoizedRankingData.length > 0) {
      setLoading(false);
    }
  }, [memoizedRankingData]);

  return (
    <>
      {loading ? (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          initialSlide={2}
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
          }}
          navigation={true}
          modules={[EffectCoverflow, Navigation]}
          className="carousel-img-wrap"
        >
          {skeletonSlides.map((_, index) => (
            <SwiperSlide
              key={index}
              className={`skeleton-carousel-img-card`}
            ></SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          initialSlide={2}
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
          }}
          navigation={true}
          modules={[EffectCoverflow, Navigation]}
          className="carousel-img-wrap"
        >
          {memoizedRankingData.map((newArr, index) => (
            <SwiperSlide className={`carousel-img-card}`} key={index}>
              <div className="carousel-card-container">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${newArr.productThumbnails}`}
                  alt={index}
                  className={`carousel-img`}
                  onClick={() => navigate(`/product/${newArr.productId}`)}
                />
                <div className="carousel-text">
                  {/* <span
                    className="carousel-text-pd-type"
                    onClick={() => navigate(`/product/${newArr.productId}`)}
                  >
                    {newArr.productType}
                  </span> */}
                  {newArr.isDiscount === true && (
                    <span
                      className="carousel-text-pd-discount"
                      onClick={() => navigate(`/product/${newArr.productId}`)}
                    >
                      {`${newArr.discountRate}% 할인 중`}
                    </span>
                  )}
                  {newArr.isRecommend === true && (
                    <span
                      className="carousel-text-pd-recommend"
                      onClick={() => navigate(`/product/${newArr.productId}`)}
                    >
                      추천 상품!
                    </span>
                  )}
                  <span
                    className="carousel-text-pd-name"
                    onClick={() => navigate(`/product/${newArr.productId}`)}
                  >
                    {newArr.productName}
                  </span>
                  {/* <span
                    className="carousel-text-pd-price"
                    onClick={() => navigate(`/product/${newArr.productId}`)}
                  >
                    {`${newArr.price} 원`}
                  </span> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default Carousel;
