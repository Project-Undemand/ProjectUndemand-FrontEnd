import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// CSS
import "./MyPaymentHistoryPage.css";
import "../../components/ReviewModal/ReviewModal.css";

import { handleCartSubmit, handleAddAllToCart } from "../CartPage/CartUtil.jsx";
import { ReviewModal } from "../../components/ReviewModal/ReviewModal.jsx";
import { MyProfilePage } from "../MyProfilePage/MyProfilePage.jsx";

function MyPaymentHistoryPage({
  isLoggedin,
  memberId,
  profileData,
  profileImageUrl,
  cartProducts,
  setCartProducts,
  orderGroup,
  productInventory,
  setLocalOrderGroup,
  setProductInventory,
}) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const ReviewTitleImage =
    "https://png.pngtree.com/png-clipart/20220530/original/pngtree-shopping-basket-equipment-market-mall-png-image_7768946.png";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchInvenId = (color, size) => {
    if (color && size) {
      const searchInventory = productInventory.find(
        (item) => item.color === color && item.size === size
      );
      if (searchInventory) {
        return searchInventory.inventoryId;
      }
    }
    return null;
  };

  const parseOption = (option) => {
    const [color, size] = option.split(", ").map((item) => item.trim());
    return { color, size };
  };

  const handleViewDetail = (orderId) => {
    navigate(`/user/mypage/payment-detail/${orderId}`, {
      state: orderGroup[orderId],
    });
  };

  const openReviewModal = (orderId) => {
    setIsReviewModalOpen((prevState) => ({
      ...prevState,
      [orderId]: true,
    }));
  };

  const closeReviewModal = (orderId) => {
    setIsReviewModalOpen((prevState) => ({
      ...prevState,
      [orderId]: false,
    }));
  };

  return (
    <div className="my-payment-history-page">
      <MyProfilePage
        isLoggedin={isLoggedin}
        memberId={memberId}
        profileData={profileData}
        profileImageUrl={profileImageUrl}
      />
      <div className="payhis-page-title-container">
        <div className="payhis-page-title">
          <span>구매 내역</span>
          <div className="total-payhis-count">
            ({`${Object.keys(orderGroup).length}개`})
          </div>
        </div>
      </div>
      <div className="payhis-page-filter">
        <div className="payhis-sort-box"></div>
        <div className="payhis-search-option"></div>
        <div className="payhis-filter-box"></div>
      </div>
      {Object.keys(orderGroup).map((orderId) => (
        <div key={orderId} className="payment-histories">
          <div className="payment-content-title">
            <span className="weight-font17">
              {new Date(orderGroup[orderId].paiedAt).toLocaleDateString()}
            </span>
            <button
              className="payhisSmallButton"
              onClick={() => handleViewDetail(orderId)}
            >
              상세보기
            </button>
          </div>
          <div
            className="payment-history-container"
            style={{ marginTop: "20px" }}
          >
            <div className="payhis-container">
              <div className="payhis-info-container">
                <span className="weight-font17">배송시작</span>
                <span className="weight-font17">주문 번호 : {orderId}</span>
              </div>
              {orderGroup[orderId].products.map((product, index) => {
                const productImgPathUrl = `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${product.imagePath}`;
                const { color, size } = parseOption(product.option);
                const invenId = handleSearchInvenId(color, size);

                return (
                  <div key={index} className="payhis-product-info-container">
                    <Link to={`/product/${product.productId}`}>
                      <img
                        src={productImgPathUrl}
                        alt={product.productName}
                        className="payhis-product-img"
                      />
                    </Link>
                    <div className="payhis-product-info">
                      <div className="price-cart-container">
                        <span className="weight-font17">
                          {product.productName}, {product.option}
                        </span>
                      </div>
                      <div className="price-cart-container">
                        <span className="weight-font17">
                          {product.productPrice} 원, {product.productQuantity}{" "}
                          개
                        </span>
                        <button
                          className="payhisSmallButton"
                          onClick={() =>
                            handleCartSubmit(
                              isLoggedin,
                              invenId,
                              memberId,
                              product.productQuantity,
                              setCartProducts,
                              navigate
                            )
                          }
                        >
                          To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="payment-history-btn-container">
            <button className="payhisSmallButton">교환, 반품신청</button>
            <button className="payhisSmallButton">배송 조회</button>
          </div>
          <div className="payment-history-review-container">
            <button
              className="payhisSmallButton"
              onClick={() => openReviewModal(orderId)}
            >
              구매후기 쓰기
            </button>
          </div>
          {isReviewModalOpen[orderId] && (
            <div className="review-modal-overlay">
              <div className="review-modal-container">
                <div className="review-modal-body">
                  <div className="review-close-button">
                    <div className="payment-review-title">
                      <img
                        src={ReviewTitleImage}
                        alt={`review-title`}
                        className="review-image-preview"
                      />
                      <span>구매후기 작성하기</span>
                    </div>

                    <button onClick={() => closeReviewModal(orderId)}>
                      <img
                        src="https://w7.pngwing.com/pngs/336/356/png-transparent-close-remove-delete-x-cross-reject-basic-user-interface-icon.png"
                        alt="Close"
                        className="review-close-image"
                      />
                    </button>
                  </div>
                  <ReviewModal
                    memberId={memberId}
                    isOpen={isReviewModalOpen[orderId]}
                    onClose={() => closeReviewModal(orderId)}
                    orderId={orderId}
                    orderGroup={orderGroup}
                    setLocalOrderGroup={setLocalOrderGroup}
                    setProductInventory={setProductInventory}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="payment-history-cart-container">
            <button
              className="payhisSmallButton"
              onClick={() =>
                handleAddAllToCart(
                  isLoggedin,
                  orderId,
                  orderGroup,
                  handleSearchInvenId,
                  memberId,
                  setCartProducts,
                  navigate,
                  parseOption
                )
              }
            >
              전체 상품 장바구니에 담기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to group payments by orderId
export const groupByOrderId = (paymentHistory) => {
  return paymentHistory.reduce((groups, payment) => {
    const {
      orderId,
      paymentId,
      memberId,
      buyerAddr,
      discount,
      merchantUid,
      ordererName,
      orderedAt,
      paiedAt,
      payMethod,
      phoneNumber,
      review,
      statusType,
      totalPrice,
      imagePath,
      productName,
      productPrice,
      productQuantity,
      option,
      productId,
    } = payment;

    if (!groups[orderId]) {
      groups[orderId] = {
        orderId,

        memberId,
        buyerAddr,
        discount,
        merchantUid,
        ordererName,
        orderedAt,
        paiedAt,
        payMethod,
        phoneNumber,
        statusType,
        totalPrice,
        products: [],
      };
    }

    groups[orderId].products.push({
      imagePath,
      productName,
      productPrice,
      productQuantity,
      option,
      productId,
      paymentId,
      review,
    });

    return groups;
  }, {});
};

export { MyPaymentHistoryPage };
