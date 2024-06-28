import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
// CSS
import "./PaymentDetailPage.css";
import { handleCartSubmit, handleAddAllToCart } from "../CartPage/CartUtil.jsx";
import { MyProfilePage } from "../MyProfilePage/MyProfilePage.jsx";

function PaymentDetailPage({
  isLoggedin,
  memberId,
  profileData,
  profileImageUrl,
  cartProducts,
  setCartProducts,
}) {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state || {};
  const [orderGroup, setOrderGroup] = useState({});
  const [orderDetail, setOrderDetail] = useState(paymentDetails);
  const [productInventory, setProductInventory] = useState([]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const authorization = localStorage.getItem("Authorization");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/paymenthistory/${memberId}`,
          {
            headers: {
              Authorization: authorization,
            },
            withCredentials: true,
          }
        );

        const groupedData = groupByOrderId(response.data);
        setOrderGroup(groupedData);
        const detail = groupedData[orderId] || {};
        setOrderDetail(detail);
        console.log(detail);

        // 각 상품에 대해 데이터 조회
        const fetchProductData = async () => {
          const inventories = [];
          for (const product of detail.products) {
            const productResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${product.productId}`
            );

            if (productResponse.status === 200) {
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
                (inven) =>
                  parseInt(inven.productId) === parseInt(product.productId)
              );

              inventories.push(...filteredInventory);
            }
          }
          setProductInventory(inventories);
        };

        fetchProductData();
      } catch (error) {
        console.error(`잘못된 요청입니다:`, error);
      }
    };

    fetchPaymentHistory();
  }, [memberId, orderId]);

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

  const getStatusTypeInKorean = (statusType) => {
    switch (statusType) {
      case "COMPLETE_PAYMENT":
        return "결제 완료";
      case "CANCELED":
        return "취소됨";
      case "REFUND":
        return "환불됨";
      default:
        return statusType;
    }
  };

  return (
    <div className="payment-detail-container">
      <MyProfilePage
        isLoggedin={isLoggedin}
        memberId={memberId}
        profileData={profileData}
        profileImageUrl={profileImageUrl}
      />
      <div className="payment-histories">
        <h1>주문 상세</h1>
        {orderDetail && Object.keys(orderDetail).length > 0 ? (
          <div>
            {/* MyPaymentHistoryPage */}
            <div key={orderId} className="histories-detail-container">
              <div className="payment-content-title">
                <span className="weight-font17">
                  {new Date(orderDetail.paiedAt).toLocaleDateString()}
                </span>
                <span className="weight-font17">주문 번호 {orderId}</span>
              </div>
              <div className="order-detail payhis-container">
                <h2>결제 정보</h2>
                <hr
                  style={{ border: "0.5px solid #fafafa", margin: "8px 0" }}
                />
                <div className="payment-content-title">
                  <span>상품 가격</span>
                  <span>{orderDetail.totalPrice} 원</span>
                </div>
                <div className="payment-content-title">
                  <span>할인 금액</span>
                  <span>0 원</span>
                </div>
                <div className="payment-content-title">
                  <span>배송비</span>
                  <span>0 원</span>
                </div>
                <div className="payment-content-title">
                  <span>결제 상태</span>
                  <span>{getStatusTypeInKorean(orderDetail.statusType)}</span>
                </div>
                <hr
                  style={{ border: "0.5px solid #fafafa", margin: "8px 0" }}
                />
                <div className="payment-content-title">
                  <span>{orderDetail.payMethod.toUpperCase()} / 일시불</span>
                  <span>{orderDetail.totalPrice} 원</span>
                </div>
                <div className="payment-content-title">
                  <span className="weight-font17">총 결제 금액</span>
                  <span className="weight-font17">
                    {orderDetail.totalPrice} 원
                  </span>
                </div>
              </div>
              <div className="payment-history-container">
                <div className="payhis-container">
                  <div className="payhis-info-container">
                    <span className="weight-font17">배송시작</span>
                  </div>
                  {orderDetail.products.map((product, index) => {
                    const productImgPathUrl = `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${product.imagePath}`;
                    const { color, size } = parseOption(product.option);
                    const invenId = handleSearchInvenId(color, size);
                    return (
                      <div
                        key={index}
                        className="payhis-product-info-container"
                      >
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
                              {product.productPrice} 원,{" "}
                              {product.productQuantity} 개
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
              <div className="order-detail payhis-container">
                <h2>{orderDetail.ordererName}</h2>
                <hr
                  style={{ border: "0.5px solid #fafafa", margin: "10px 0" }}
                />
                <div className="payment-content-title">
                  <span>{orderDetail.buyerAddr} </span>
                </div>
                <div className="payment-content-title">
                  <span>{orderDetail.phoneNumber} </span>
                </div>
                <div className="payment-content-title">
                  <span>배송 요청사항 : 없음</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>주문 상세 정보를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
}

// Helper function to group payments by orderId
const groupByOrderId = (paymentHistory) => {
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
      bankName,
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
        paymentId,
        memberId,
        buyerAddr,
        discount,
        merchantUid,
        ordererName,
        orderedAt,
        paiedAt,
        payMethod,
        bankName,
        phoneNumber,
        review,
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
    });

    return groups;
  }, {});
};

export { PaymentDetailPage };
