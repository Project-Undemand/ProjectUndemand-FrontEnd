import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Component Imports
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
import {
  fetchPaymentHistory,
  fetchAddressLists,
  fetchProductReviewData,
  fetchWishLists,
} from "./MyPageApiUtils.jsx";

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

  useEffect(() => {
    fetchWishLists(dispatch, memberId);
    fetchPaymentHistory(
      dispatch,
      memberId,
      setLocalOrderGroup,
      setProductInventory
    );
    fetchProductReviewData(dispatch, memberId);
    fetchAddressLists(dispatch, memberId);
  }, [memberId, dispatch]);

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
              setLocalOrderGroup={setLocalOrderGroup}
              setProductInventory={setProductInventory}
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

export { MyPage, fetchAddressLists, fetchPaymentHistory };
