import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import "./ProductSlide.css";
import { Pagination, Navigation, EffectCards } from "swiper/modules";

function ProductSlide({ loading, products, sectionTitle }) {
  const skeletonSlides = Array.from({ length: 7 });
  const sectionType = sectionTitle.split(" ")[0];
  const sectionTypeUpperCase = sectionType.toUpperCase();
  const [swiper, setSwiper] = useState();
  const navigate = useNavigate();
  const handlePrev = () => {
    swiper?.slidePrev();
  };
  const handleNext = () => {
    swiper?.slideNext();
  };
  const [isWidth, setIsWidth] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsWidth(window.innerWidth <= 700);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="product-slide">
      <div className="small-title">
        <h1>{sectionTitle}</h1>
      </div>
      <div className="product-slide-container">
        {loading ? (
          <>
            {isWidth === false && (
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={20}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                onSwiper={(e) => {
                  setSwiper(e);
                }}
                modules={[Pagination, Navigation]}
              >
                {skeletonSlides.map((_, index) => (
                  <SwiperSlide
                    key={index}
                    className="swiper-slide-skeleton"
                  ></SwiperSlide>
                ))}
              </Swiper>
            )}
          </>
        ) : (
          <>
            {isWidth === false && (
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={20}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                onSwiper={(e) => {
                  setSwiper(e);
                }}
                modules={[Pagination, Navigation]}
              >
                {products.map((product) => (
                  <SwiperSlide
                    key={product.productId}
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    <div className="product-slide-card-container">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${product.productThumbnails[0]}`}
                        alt={product.productName}
                        className={`product-card-img`}
                      />
                      <div className="product-small-info">
                        <div className="pd-name-discount-recommend-wrapper">
                          <Link to={`/product/${product.productId}`}>
                            {product.productName}
                          </Link>
                          {product.isDiscount === true && (
                            <Link
                              to={`/product/${product.productId}`}
                            >{`${product.discountRate}% 할인 중`}</Link>
                          )}
                          {product.isRecommend === true && (
                            <Link to={`/product/${product.productId}`}>
                              추천상품!
                            </Link>
                          )}
                        </div>
                        <Link
                          to={`/product/${product.productId}`}
                          className="product-price"
                        >
                          {`${product.price} 원`}
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </>
        )}
        {loading ? (
          <>
            {isWidth === true && (
              <Swiper
                effect={"cards"}
                grabCursor={true}
                navigation={true}
                onSwiper={(e) => {
                  setSwiper(e);
                }}
                modules={[EffectCards, Navigation]}
              >
                {skeletonSlides.map((_, index) => (
                  <SwiperSlide
                    key={index}
                    className="swiper-slide-skeleton"
                  ></SwiperSlide>
                ))}
              </Swiper>
            )}
          </>
        ) : (
          <>
            {isWidth === true && (
              <Swiper
                effect={"cards"}
                grabCursor={true}
                navigation={true}
                onSwiper={(e) => {
                  setSwiper(e);
                }}
                modules={[EffectCards, Navigation]}
              >
                {products.map((product) => (
                  <SwiperSlide
                    key={product.productId}
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    <div className="product-slide-card-container">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${product.productThumbnails[0]}`}
                        alt={product.productName}
                        className={`product-card-img`}
                      />
                      <div className="product-small-info">
                        <div className="pd-name-discount-recommend-wrapper">
                          <Link to={`/product/${product.productId}`}>
                            {product.productName}
                          </Link>
                          {product.isDiscount === true && (
                            <Link
                              to={`/product/${product.productId}`}
                            >{`${product.discountRate}% 할인 중`}</Link>
                          )}
                          {product.isRecommend === true && (
                            <Link to={`/product/${product.productId}`}>
                              추천상품!
                            </Link>
                          )}
                        </div>
                        <Link
                          to={`/product/${product.productId}`}
                          className="product-price"
                        >
                          {`${product.price} 원`}
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </>
        )}
        <div className="swiper-button-prev" onClick={handlePrev}></div>
        <div className="swiper-button-next" onClick={handleNext}></div>
      </div>
      <Link to={`/products/${sectionTypeUpperCase}`} className="link-btn">
        Click Here to More View
      </Link>
    </section>
  );
}

export default ProductSlide;
