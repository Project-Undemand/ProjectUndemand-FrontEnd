import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

// Component Imports
import {
  setAddressList,
  setMyReviewList,
  setWishList,
  setOrderGroup,
} from "../../store";
import { MyProfilePage } from "../MyProfilePage/MyProfilePage.jsx";
import { MyPaymentHistoryPage } from "../MyPaymentHistoryPage/MyPaymentHistoryPage.jsx";
import { PaymentDetailPage } from "../PaymentDetail/PaymentDetailPage.jsx";
import { MyWishListPage } from "../MyWishListPage/MyWishListPage.jsx";
import { MyReviewPage } from "../MyReviewPage/MyReviewPage.jsx";
import { UpdateUserInfoPage } from "../UpdateUserInfoPage/UpdateUserInfoPage.jsx";
import PasswordCheckPage from "../PasswordCheckPage/PasswordCheckPage.jsx";
import { AddressListPage } from "../Address/AddressListPage.jsx";
import { AddressRegistrationPage } from "../Address/AddressRegistrationPage.jsx";
import { AddressUpdatePage } from "../Address/AddressUpdatePage.jsx";
import { groupByOrderId } from "../MyPaymentHistoryPage/MyPaymentHistoryPage.jsx";

// CSS Import
import "./MyPage.css";

function MyPage({
  isLoggedin,
  memberId,
  profileData,
  profileImageUrl,
  setProfileImageUrl,
  cartProducts,
  setCartProducts,
}) {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 훅
  const dispatch = useDispatch(); // Redux 디스패치 훅

  const [orderGroup, setLocalOrderGroup] = useState({});
  const [productInventory, setProductInventory] = useState([]);

  const fetchWishLists = async () => {
    try {
      // Authorization 헤더를 포함한 axios 요청
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/wishlist/${memberId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );

      dispatch(setWishList(response.data)); // Redux 액션 디스패치
    } catch (error) {
      console.error(`잘못된 요청입니다:`, error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      // 로컬 스토리지에서 Authorization 토큰 가져오기
      const authorization = localStorage.getItem("Authorization");

      // Authorization 헤더를 포함한 axios 요청
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/paymenthistory/${memberId}`,
        {
          headers: {
            Authorization: authorization,
          },
          withCredentials: true,
        }
      );

      // 그룹화된 데이터로 상태 설정
      const groupedData = groupByOrderId(response.data);
      setLocalOrderGroup(groupedData);
      dispatch(setOrderGroup(groupedData)); // Redux 액션 디스패치

      // 각 상품에 대해 데이터 조회
      const fetchProductData = async () => {
        const inventories = [];
        for (const orderId in groupedData) {
          const products = groupedData[orderId].products;
          for (const product of products) {
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
        }
        setProductInventory(inventories);
      };

      fetchProductData();
    } catch (error) {
      console.error(`잘못된 요청입니다:`, error);
    }
  };

  const fetchProductReviewData = async () => {
    try {
      // 로컬 스토리지에서 Authorization 토큰 가져오기
      const authorization = localStorage.getItem("Authorization");

      // Authorization 헤더를 포함한 axios 요청
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/review/user/${memberId}`,
        {
          headers: {
            Authorization: authorization,
          },
          withCredentials: true,
        }
      );

      console.log(response.data);

      dispatch(setMyReviewList(response.data)); // Redux 액션 디스패치
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchWishLists();
    fetchPaymentHistory();
    fetchProductReviewData();
    fetchAddressLists(dispatch, memberId);
  }, [memberId]);

  return (
    <div className="my-page">
      <Routes>
        <Route path="/" element={<Navigate to="profile" replace />} />
        <Route
          path="/profile"
          element={
            <MyProfilePage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
            />
          }
        />
        <Route
          path="/payment-history"
          element={
            <MyPaymentHistoryPage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
              cartProducts={cartProducts}
              setCartProducts={setCartProducts}
              orderGroup={orderGroup}
              productInventory={productInventory}
            />
          }
        />
        <Route
          path="/payment-detail/:orderId"
          element={
            <PaymentDetailPage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
              cartProducts={cartProducts}
              setCartProducts={setCartProducts}
            />
          }
        />
        <Route
          path="/my-wish-list"
          element={
            <MyWishListPage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
            />
          }
        />
        <Route
          path="/my-review"
          element={
            <MyReviewPage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
            />
          }
        />
        <Route
          path="/address"
          element={
            <AddressListPage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
            />
          }
        />
        <Route
          path="/address-registration"
          element={
            <AddressRegistrationPage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
            />
          }
        />
        <Route
          path="/address-update/:addressId"
          element={
            <AddressUpdatePage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
            />
          }
        />
        <Route
          path="/password-check"
          element={
            <PasswordCheckPage isLoggedin={isLoggedin} memberId={memberId} />
          }
        />
        <Route
          path="/update-info"
          element={
            <UpdateUserInfoPage
              isLoggedin={isLoggedin}
              memberId={memberId}
              profileData={profileData}
              profileImageUrl={profileImageUrl}
              setProfileImageUrl={setProfileImageUrl}
            />
          }
        />
      </Routes>
    </div>
  );
}

export { MyPage };

// Export fetchAddressLists function
export const fetchAddressLists = async (dispatch, memberId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/address/${memberId}`,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        withCredentials: true,
      }
    );
    dispatch(setAddressList(response.data));
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }
};

// PrivateRoutes 설정으로 인해, 이용불가. 추후 구현예정 [24.06.05]

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       if (!isLoggedin) {
//         const result = await swal({
//           title: "로그인을 하지 않은 유저는 회원 페이지를 이용할 수 없습니다.",
//           buttons: {
//             confirm: {
//               text: "로그인 페이지로 이동",
//               value: true,
//               visible: true,
//               className: "",
//               closeModal: true,
//             },
//           },
//         });

//         if (result) {
//           navigate("/login");
//         }
//       }
//     };

//     checkLoginStatus();
//   }, [isLoggedin, navigate]);
