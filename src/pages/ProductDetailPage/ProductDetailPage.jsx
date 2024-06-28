import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetailPage.css";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { MdOutlineShoppingBag } from "react-icons/md";
import ArticleViewModal from "../../components/ArticleViewModal/ArticleViewModal.jsx";
import ArticleSubmitModal from "../../components/ArticleSubmitModal/ArticleSubmitModal.jsx";
import WishBtn from "../../components/WishBtn/WishBtn.jsx";
import { handleCartSubmit } from "../CartPage/CartUtil.jsx";
import swal from "sweetalert";

function ProductDetailPage({ isLoggedin, memberId, setCartProducts }) {
  let { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [pHistories, setPHistories] = useState([]);
  const [fPHistories, setFPHistories] = useState([]);
  const [productReviewData, setProductReviewData] = useState([]);
  const [productInquiryData, setProductInquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [dropdownStates, setDropdownStates] = useState([false, false, false]);
  const [reviewAndInquiryModalOpen, setReviewAndInquiryModalOpen] =
    useState(false);
  const [
    reviewWritingAndInquiryPostingModalOpen,
    setReviewWritingAndInquiryPostingModalOpen,
  ] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [productInventory, setProductInventory] = useState([]);
  const [productColor, setProductColor] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedInvenId, setSelectedInvenId] = useState(null);
  const [firstClick, setFirstClick] = useState(true);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState();
  const [reviewImgLoadError, setReviewImgLoadError] = useState(false);
  const errorReviewImgSrc =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTRx9zMfm7p_YRHoXXLVhaI2YpE4bMGgwnyg&s";

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${productId}`
      );
      if (response.status === 200) {
        setProduct(response.data);
        setLoading(false);
      }
      const invenResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/inventory`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      const invenResData = invenResponse.data;
      const filteredInventory = invenResData.filter(
        (inven) => parseInt(inven.productId) === parseInt(productId)
      );
      setProductInventory(filteredInventory);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchThumbnail = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/thumbnail/${productId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      setThumbnailImages(response.data);
    } catch (error) {
      console.error("Error fetching thumbnail:", error);
    }
  };

  const fetchPaymentHistory = async () => {
    if (isLoggedin === true) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/paymenthistory/${memberId}`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
            withCredentials: true,
          }
        );
        const paymentHistories = response.data.filter(
          (paymentHistory) => paymentHistory.productName === product.productName
        );
        setPHistories(paymentHistories);
        const filteredPaymentHistories = response.data.filter(
          (paymentHistory) =>
            paymentHistory.productName === product.productName &&
            !paymentHistory.review
        );
        setFPHistories(filteredPaymentHistories);
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };

  const fetchProductReviewData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/review/product/${productId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      setProductReviewData(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchProductInquiryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/inquiry/list/${productId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      setProductInquiryData(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const remainingStars = 5 - filledStars;

    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <FaStar key={index} />
        ))}
        {[...Array(remainingStars)].map((_, index) => (
          <FaRegStar key={filledStars + index} />
        ))}
      </>
    );
  };

  useEffect(() => {
    const colors = productInventory.map((item) => item.color);
    const uniqueColors = [...new Set(colors)];
    setProductColor(uniqueColors);
  }, [productInventory]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    const filteredSizes = productInventory
      .filter((item) => item.color === color)
      .map((item) => item.size);
    setSizes(filteredSizes);
    setSelectedSize(null);
    setSelectedInvenId(null);
  };

  const handleSizeClick = (size) => {
    if (!checkSizeAvailability(size)) {
      return;
    } else {
      setSelectedSize(size);
    }
  };

  const checkSizeAvailability = (size) => {
    const availableInventory = productInventory.find(
      (item) =>
        item.color === selectedColor &&
        item.size === size &&
        item.productStock > 0
    );
    return availableInventory ? true : false;
  };

  const handleSearchInvenId = () => {
    if (selectedColor && selectedSize) {
      const searchInventory = productInventory.find(
        (item) => item.color === selectedColor && item.size === selectedSize
      );
      if (searchInventory) {
        setSelectedInvenId(searchInventory.inventoryId);
      }
    }
  };

  const handleIncrement = () => {
    if (quantity < 100) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      if (firstClick) {
        setFirstClick(false);
      }
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const toggleDropdown = (index) => {
    setDropdownStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const openArticleViewModal = (type) => {
    setModalType(type);
    setReviewAndInquiryModalOpen(true);
  };

  const closeArticleViewModal = () => {
    setReviewAndInquiryModalOpen(false);
  };

  const openArticleSubmitModal = (type) => {
    if (type === "review") {
      if (isLoggedin) {
        if (pHistories.length === 0) {
          swal({
            title:
              "구매하지 않은 상품입니다. 상품 구매 후 리뷰를 작성할 수 있어요!",
          });
          setReviewWritingAndInquiryPostingModalOpen(false);
        } else {
          const allReviewsTrue = pHistories.every(
            (paymentHistory) => paymentHistory.review === true
          );

          if (allReviewsTrue) {
            swal({
              title: "이미 해당 상품의 모든 옵션에 대해 리뷰를 남기셨어요!",
              text: "내 리뷰 페이지로 이동할까요?",
              icon: "info",
              buttons: {
                cancel: "취소",
                navigate: "확인",
              },
            }).then((value) => {
              switch (value) {
                case "navigate":
                  navigate("/user/mypage/my-review");
                  break;

                default:
                  break;
              }
            });
          } else {
            setModalType(type);
            setReviewWritingAndInquiryPostingModalOpen(true);
          }
        }
      } else {
        swal({
          title: "로그인 후 이용 가능해요!",
        });
      }
    } else {
      setModalType(type);
      setReviewWritingAndInquiryPostingModalOpen(true);
    }
  };

  const closeArticleSubmitModal = () => {
    setReviewWritingAndInquiryPostingModalOpen(false);
  };

  useEffect(() => {
    fetchProduct();
    fetchThumbnail();
    fetchProductReviewData();
    fetchProductInquiryData();

    return () => {
      localStorage.removeItem("isWishlist");
    };
  }, [productId]);

  useEffect(() => {
    fetchPaymentHistory();
  }, [product.productName]);

  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
  }, [selectedColor]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  useEffect(() => {
    setFirstClick(true);
  }, [selectedSize, productColor]);

  useEffect(() => {
    handleSearchInvenId();
  }, [selectedColor, selectedSize, productInventory]);

  return (
    <div className="detail-page">
      {loading ? (
        <div className="loading-fail">로딩중...</div>
      ) : (
        <>
          <div className="img-and-option-section">
            <div className="img-box">
              <ul className="thumbnail-img-container">
                {thumbnailImages.map((thumbnailImage, index) => {
                  return (
                    <li key={index} className="thumbnail-img">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${thumbnailImage}`}
                        alt="Thumbnail"
                        onClick={() => setSelectedThumbnail(thumbnailImage)}
                      />
                    </li>
                  );
                })}
              </ul>
              <div className="hero-img-container">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${
                    selectedThumbnail !== undefined
                      ? selectedThumbnail
                      : thumbnailImages[0]
                  }`}
                  alt="Thumbnail"
                  className="hero-img"
                />
              </div>
            </div>
            <div className="option-and-info-box">
              <div className="option-container">
                <ul className="option-txt-box">
                  {product.isDiscount && (
                    <li className="is-discount">{`${product.discountRate}% 할인 중!`}</li>
                  )}
                  <li className="product-name">{product.productName}</li>
                  <li className="product-type">{product.productType}</li>
                  <li className="product-price">{product.price} 원</li>
                </ul>
                <div className="option-select-box">
                  <div className="option-color-container">
                    <p>색상 선택</p>
                    <ul>
                      {productColor.map((color, index) => (
                        <li
                          key={index}
                          className={`option-color ${
                            selectedColor === color ? "selected-color" : ""
                          }`}
                          onClick={() => handleColorClick(color)}
                        >
                          {color}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selectedColor ? (
                    <div className={`option-size-container`}>
                      <p>사이즈 선택</p>
                      <ul>
                        {sizes.map((size, index) => {
                          const available = checkSizeAvailability(size);
                          return (
                            <li
                              key={index}
                              className={`option-size ${
                                selectedSize === size ? "selected-size" : ""
                              } ${!available ? "unavailable" : " "}`}
                              onClick={() => handleSizeClick(size)}
                            >
                              {size}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="selected-color-null"></div>
                  )}
                  {selectedSize ? (
                    <div className={`option-quantity-container`}>
                      <p>수량 선택</p>
                      <div className="quantity-input">
                        <p>{quantity}</p>
                        <div className="btn-flex">
                          <MdOutlineKeyboardArrowUp
                            onClick={() => handleIncrement()}
                          />
                          <MdOutlineKeyboardArrowDown
                            onClick={() => handleDecrement()}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="selected-size-null"></div>
                  )}
                </div>
                <div className="option-btn-box">
                  <ul className="option-btn-container">
                    {/* <li className="option-btn">주문하기</li> */}
                    <li
                      className="option-btn"
                      onClick={() =>
                        handleCartSubmit(
                          isLoggedin,
                          selectedInvenId,
                          memberId,
                          quantity,
                          setCartProducts,
                          navigate
                        )
                      }
                    >
                      <MdOutlineShoppingBag />
                      <span>장바구니</span>
                    </li>
                    <WishBtn
                      memberId={memberId}
                      productId={productId}
                      isLoggedin={isLoggedin}
                      pageType={"productDetail"}
                    />
                  </ul>
                </div>
              </div>
              <div className="option-dropdown-info">
                <ul className="option-dropdown-info-container">
                  <li className="option-info">
                    <div
                      className="option-info-title"
                      onClick={() => toggleDropdown(0)}
                    >
                      <p>상품 설명</p>
                      {dropdownStates[0] ? (
                        <MdOutlineKeyboardArrowUp />
                      ) : (
                        <MdOutlineKeyboardArrowDown />
                      )}
                    </div>
                    <ul
                      className={`option-info-script ${
                        dropdownStates[0] ? "open" : ""
                      }`}
                    >
                      <li>{`상품 설명: ${product.productInfo}`}</li>
                      <li>{`제조사: ${product.manufacturer}`}</li>
                    </ul>
                  </li>
                  <li className="option-info">
                    <div
                      className="option-info-title"
                      onClick={() => toggleDropdown(1)}
                    >
                      <p>리뷰</p>
                      {dropdownStates[1] ? (
                        <MdOutlineKeyboardArrowUp />
                      ) : (
                        <MdOutlineKeyboardArrowDown />
                      )}
                    </div>
                    <ul
                      className={`option-info-script ${
                        dropdownStates[1] ? "open" : ""
                      }`}
                    >
                      <li className="article-link">
                        <Link onClick={() => openArticleSubmitModal("review")}>
                          리뷰 작성하기
                        </Link>
                      </li>
                      {productReviewData.length > 0 &&
                        productReviewData.map((tableRow, index) => (
                          <li
                            key={tableRow.reviewId}
                            className="detail-page-review-container"
                          >
                            <div className="rating-and-write-info">
                              <span>{renderStars(tableRow.rating)}</span>
                              <div>
                                {tableRow.writer !== null ? (
                                  <span>
                                    {`${tableRow.writer.slice(0, 1)}${"*"
                                      .repeat(
                                        Math.max(0, tableRow.writer.length - 1)
                                      )
                                      .slice(0, 2)}`}
                                  </span>
                                ) : (
                                  <span></span>
                                )}
                                <span>
                                  {tableRow.updatedAt.substring(0, 10)}
                                </span>
                              </div>
                            </div>
                            <div className="detail-page-review-content">
                              {tableRow.reviewContent}
                            </div>
                            {tableRow.reviewImgPaths.length > 0 && (
                              <img
                                src={`${
                                  reviewImgLoadError
                                    ? errorReviewImgSrc
                                    : process.env.REACT_APP_BACKEND_URL_FOR_IMG
                                }${tableRow.reviewImgPaths[0]}`}
                                alt={`상품명 ${product.productName}의 ${index}번 리뷰`}
                                onError={() => setReviewImgLoadError(true)}
                                className="detail-page-review-img"
                              />
                            )}
                          </li>
                        ))}
                      <li className="article-link">
                        <Link onClick={() => openArticleViewModal("review")}>
                          리뷰 더 보기
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="option-info">
                    <div
                      className="option-info-title"
                      onClick={() => toggleDropdown(2)}
                    >
                      <p>Q&A</p>
                      {dropdownStates[2] ? (
                        <MdOutlineKeyboardArrowUp />
                      ) : (
                        <MdOutlineKeyboardArrowDown />
                      )}
                    </div>
                    <ul
                      className={`option-info-script ${
                        dropdownStates[2] ? "open" : ""
                      }`}
                    >
                      <li className="article-link">
                        <Link onClick={() => openArticleSubmitModal("inquiry")}>
                          상품 문의하기
                        </Link>
                      </li>
                      {productInquiryData.map((tableRow) => (
                        <li
                          key={tableRow.inquiryId}
                          className="detail-page-inquiry-container"
                        >
                          <div className="detail-page-inquiry-title">
                            <span>{tableRow.inquiryTitle}</span>
                          </div>
                          <div className="category-and-write-info">
                            <span>{tableRow.inquiryType}</span>
                            <div>
                              <span>
                                {`${tableRow.name.slice(0, 1)}${"*"
                                  .repeat(Math.max(0, tableRow.name.length - 1))
                                  .slice(0, 2)}`}
                              </span>
                              <span>{tableRow.createdAt.substring(0, 10)}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                      <li className="article-link">
                        <Link onClick={() => openArticleViewModal("inquiry")}>
                          문의 글 더 보기
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
                {reviewAndInquiryModalOpen && (
                  <ArticleViewModal
                    modalType={modalType}
                    modalClose={closeArticleViewModal}
                    productReviewData={productReviewData}
                    productInquiryData={productInquiryData}
                    product={product}
                    thumbnailImage={thumbnailImages[0]}
                    memberId={memberId}
                  ></ArticleViewModal>
                )}
                {reviewWritingAndInquiryPostingModalOpen && (
                  <ArticleSubmitModal
                    modalType={modalType}
                    modalClose={closeArticleSubmitModal}
                    paymentHistories={fPHistories}
                    product={product}
                    updateReviewData={fetchProductReviewData}
                    updateinquiryData={fetchProductInquiryData}
                    isLoggedin={isLoggedin}
                    memberId={memberId}
                  ></ArticleSubmitModal>
                )}
              </div>
            </div>
          </div>
          <div className="detail-section">
            <div className="detail-img-box">
              <ul className="detail-img-container">
                {product.contentImages.length > 0 &&
                  product.contentImages.map((contentImage, index) => {
                    return (
                      <li key={index} className="detail-img">
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${contentImage}`}
                          alt=""
                        />
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { ProductDetailPage };
