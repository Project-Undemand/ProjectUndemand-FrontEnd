import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddressRegistration from "../../components/AddressComponents/AddressRegistration.jsx";
import AddressList from "../../components/AddressComponents/AddressList.jsx";
import axios from "axios";
import swal from "sweetalert";
import "./PaymentPage.css";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { memberId } = location.state;
  const [addressData, setAddressData] = useState({
    addressId: "",
    addressName: "",
    recipient: "",
    postCode: "",
    address: "",
    detailAddress: "",
    phoneNumberPrefix: "010",
    phoneNumberPart1: "",
    phoneNumberPart2: "",
    recipientPhone: "",
    saveAddress: false,
  });
  const [fetchBasicOnCheckbox, setFetchBasicOnCheckbox] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressData, setSelectedAddressData] = useState([]);
  const [ordererName, setOrdererName] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postCode, setPostCode] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [notAllow, setNotAllow] = useState(true);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState("");
  const [showPayOption, setShowPayOption] = useState(false);
  const axiosInstance = axios.create({ withCredentials: true });

  useEffect(() => {
    if (addressModalOpen) {
      document.body.classList.add("no-scroll");
      document
        .querySelector(".payment-page-wrapper")
        .classList.add("no-pointer-events");
    } else {
      document.body.classList.remove("no-scroll");
      document
        .querySelector(".payment-page-wrapper")
        .classList.remove("no-pointer-events");
    }
  }, [addressModalOpen]);

  useEffect(() => {
    if (ordererName && address && detailAddress && phoneNumber && postCode) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
      setShowPayOption(false);
    }
  }, [ordererName, address, detailAddress, phoneNumber, postCode]);

  useEffect(() => {
    const handleFetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/cart/${memberId}`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
            withCredentials: true,
          }
        );
        setCartProducts(response.data);
      } catch (error) {
        console.error(`잘못된 요청입니다:`, error);
      }
    };

    handleFetchProduct();
  }, [memberId]);

  useEffect(() => {
    let totalPriceSum = 0;

    cartProducts.forEach((cartProduct) => {
      totalPriceSum += cartProduct.totalPrice;
    });

    setTotalPrice(totalPriceSum);
  }, [cartProducts]);

  async function completeOrder() {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/order/done`,
        {
          postCode: postCode,
          address: address,
          detailAddress: detailAddress,
          ordererName: ordererName,
          phoneNumber: phoneNumber,
          payMethod: payMethod,
        },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      );
      console.log(response.data);
      handlePayment(response.data);
    } catch (error) {
      console.error("Error completing order:", error);
    }
  }

  async function handlePayment(orderInfo) {
    window.IMP.init("imp04081725");
    window.IMP.request_pay(
      {
        pg: "kicc",
        pay_method: orderInfo.payMethod,
        merchant_uid: orderInfo.merchantUid,
        name: orderInfo.productName,
        amount: orderInfo.totalPrice,
        buyer_name: orderInfo.ordererName,
        buyer_tel: orderInfo.phoneNumber,
        buyer_postcode: orderInfo.postCode,
        buyer_addr: orderInfo.address,
      },
      (rsp) => {
        if (rsp.success) {
          axios
            .post(
              `${process.env.REACT_APP_BACKEND_BASE_URL}/order/payment/${rsp.imp_uid}`,
              {
                memberId: orderInfo.memberId,
                orderId: orderInfo.orderId,
                price: orderInfo.totalPrice,
                inventoryIdList: orderInfo.productMgtIds,
              },
              {
                headers: {
                  Authorization: localStorage.getItem("Authorization"),
                },
                withCredentials: true,
              }
            )
            .then((res) => {
              console.log(rsp);
              navigate("/cart/order/done", {
                state: {
                  memberId: orderInfo.memberId,
                  ordererName: orderInfo.ordererName,
                  productMgtIds: orderInfo.productMgtIds,
                  orderId: orderInfo.orderId,
                  orderDay: orderInfo.orderDay,
                  address: orderInfo.address,
                  detailAddress: orderInfo.detailAddress,
                  totalPrice: orderInfo.totalPrice,
                },
              });
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.error(rsp.error_msg);
        }
      }
    );
  }

  const handleShowPayOption = () => {
    if (addressData.saveAddress) {
      handleNewAddressSubmit().then(() => {
        proceedToPayment();
      });
    } else {
      proceedToPayment();
    }
  };

  const handleNewAddressSubmit = async () => {
    const { saveAddress, ...addressDataToSubmit } = addressData;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/address/${memberId}`,
        addressDataToSubmit,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      console.log("Address created:", response.data);
    } catch (error) {
      console.error("Error creating address:", error);
    }
  };

  const proceedToPayment = () => {
    if (notAllow) {
      swal({
        title: "모든 입력란을 작성해 주세요!",
        icon: "info",
        buttons: "확인",
      });
    } else {
      setShowPayOption(true);
    }
  };

  useEffect(() => {
    setOrdererName(`${addressData.recipient}`);
    setAddress(`${addressData.address}`);
    setDetailAddress(`${addressData.detailAddress}`);
    setPhoneNumber(
      `${addressData.phoneNumberPrefix}-${addressData.phoneNumberPart1}-${addressData.phoneNumberPart2}`
    );
    setPostCode(`${addressData.postCode}`);
  }, [addressData]);

  useEffect(() => {
    if (fetchBasicOnCheckbox && defaultAddress && defaultAddress.length > 0) {
      setAddressData({
        addressId: defaultAddress[0].addressId || "",
        addressName: defaultAddress[0].addressName || "",
        recipient: defaultAddress[0].recipient || "",
        postCode: defaultAddress[0].postCode || "",
        address: defaultAddress[0].address || "",
        detailAddress: defaultAddress[0].detailAddress || "",
        phoneNumberPrefix: defaultAddress[0].recipientPhone
          ? defaultAddress[0].recipientPhone.split("-")[0]
          : "010",
        phoneNumberPart1: defaultAddress[0].recipientPhone
          ? defaultAddress[0].recipientPhone.split("-")[1]
          : "",
        phoneNumberPart2: defaultAddress[0].recipientPhone
          ? defaultAddress[0].recipientPhone.split("-")[2]
          : "",
        recipientPhone: defaultAddress[0].recipientPhone || "",
      });
    } else {
      setAddressData({
        addressId: "",
        addressName: "",
        recipient: "",
        postCode: "",
        address: "",
        detailAddress: "",
        phoneNumberPrefix: "010",
        phoneNumberPart1: "",
        phoneNumberPart2: "",
        recipientPhone: "",
      });
    }
  }, [fetchBasicOnCheckbox, defaultAddress]);

  useEffect(() => {
    if (selectedAddressData) {
      setAddressData({
        addressId: selectedAddressData.addressId || "",
        addressName: selectedAddressData.addressName || "",
        recipient: selectedAddressData.recipient || "",
        postCode: selectedAddressData.postCode || "",
        address: selectedAddressData.address || "",
        detailAddress: selectedAddressData.detailAddress || "",
        phoneNumberPrefix: selectedAddressData.recipientPhone
          ? selectedAddressData.recipientPhone.split("-")[0]
          : "010",
        phoneNumberPart1: selectedAddressData.recipientPhone
          ? selectedAddressData.recipientPhone.split("-")[1]
          : "",
        phoneNumberPart2: selectedAddressData.recipientPhone
          ? selectedAddressData.recipientPhone.split("-")[2]
          : "",
        recipientPhone: selectedAddressData.recipientPhone || "",
      });
    } else {
      setAddressData({
        addressId: "",
        addressName: "",
        recipient: "",
        postCode: "",
        address: "",
        detailAddress: "",
        phoneNumberPrefix: "010",
        phoneNumberPart1: "",
        phoneNumberPart2: "",
        recipientPhone: "",
      });
    }
  }, [selectedAddressData]);

  return (
    <div className={`payment-page`}>
      <header className={`payment-page-title`}>결제하기</header>
      <div className={`payment-page-wrapper`}>
        <div className="order-section">
          <div className="delivery">
            <header>
              배송 옵션
              <button
                className="address-list-btn"
                onClick={() => setAddressModalOpen(true)}
              >
                배송지 조회
              </button>
            </header>
            <AddressRegistration
              memberId={memberId}
              addressData={addressData}
              setAddressData={setAddressData}
              defaultAddress={defaultAddress}
              setDefaultAddress={setDefaultAddress}
              fetchBasicOnCheckbox={fetchBasicOnCheckbox}
              setFetchBasicOnCheckbox={setFetchBasicOnCheckbox}
              setAddressModalOpen={setAddressModalOpen}
              selectedAddressData={selectedAddressData}
            />
            <div className="button-section">
              <button
                onClick={() => handleShowPayOption()}
                className="save-button"
              >
                저장 및 계속
              </button>
            </div>
          </div>
          <div className="payment">
            <header>결제</header>
            {showPayOption && (
              <>
                <div className="payment-option">
                  <span>결제 수단 선택</span>
                  <div className="payment-option-select">
                    <button
                      onClick={() => setPayMethod("card")}
                      className={`option-pay-method ${
                        payMethod === "card" ? "selected-pay-method" : ""
                      }`}
                    >
                      카드
                    </button>
                    <button
                      onClick={() => setPayMethod("trans")}
                      className={`option-pay-method ${
                        payMethod === "trans" ? "selected-pay-method" : ""
                      }`}
                    >
                      계좌이체
                    </button>
                    <button
                      onClick={() => setPayMethod("vbank")}
                      className={`option-pay-method ${
                        payMethod === "vbank" ? "selected-pay-method" : ""
                      }`}
                    >
                      가상계좌
                    </button>
                    <button
                      onClick={() => setPayMethod("phone")}
                      className={`option-pay-method ${
                        payMethod === "phone" ? "selected-pay-method" : ""
                      }`}
                    >
                      휴대폰 결제
                    </button>
                  </div>
                </div>
                <div className="button-section">
                  <button
                    disabled={notAllow}
                    onClick={() => completeOrder()}
                    className="save-button"
                  >
                    주문하기
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="order-review">
            <header>주문 완료</header>
          </div>
        </div>
        <div className="cart-section">
          <header className="cart-title">장바구니</header>
          <div className="cart-info">
            <div className="cart-price">
              <span>상품 금액</span>
              <span>{`${totalPrice} 원`}</span>
            </div>
            <div className="cart-delivery-fee">
              <span>배송비</span>
              <span>0 원</span>
            </div>
            <div className="cart-total-price">
              <span>총 결제 금액</span>
              <span>{`${totalPrice} 원`}</span>
            </div>
            {cartProducts.map((cartProduct) => (
              <div key={cartProduct.cartId} className="cart-product">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${cartProduct.productThumbnail}`}
                  alt=""
                />
                <div className="cart-product-info">
                  <span>{cartProduct.productName}</span>
                  <span>{`색상: ${cartProduct.color}`}</span>
                  <span>{`사이즈: ${cartProduct.size}`}</span>
                  <span>{`가격: ${cartProduct.productPrice} 원`}</span>
                  <span>{`수량: ${cartProduct.quantity} / ${cartProduct.totalPrice} 원`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AddressList
        memberId={memberId}
        addressModalOpen={addressModalOpen}
        setAddressModalOpen={setAddressModalOpen}
        selectedAddressData={selectedAddressData}
        setSelectedAddressData={setSelectedAddressData}
      />
    </div>
  );
}

export { PaymentPage };
