import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./MyProfilePage.css";

function MyProfilePage({ isLoggedin, memberId, profileData, profileImageUrl }) {
  const email = profileData?.member?.email || "이메일";
  const username = profileData?.member?.username || "이름";
  const nickname = profileData?.member?.nickname || "닉네임";
  const memberAges = profileData?.memberAges || "성별";
  const memberGender = profileData?.memberGender || "연령대";
  const joinedAt =
    profileData?.member?.joined_at.substring(0, 10) || "가입날짜";
  const memberRole =
    profileData?.member?.member_role === "ADMIN"
      ? "관리자 멤버"
      : profileData?.member?.member_role === "SELLER"
      ? "판매자 멤버"
      : "일반 멤버";
  const orderGroup = useSelector((state) => state.orderGroup);
  const wishLists = useSelector((state) => state.wishList);
  const myReviewList = useSelector((state) => state.myReviewList);
  const addressList = useSelector((state) => state.addressList);
  const orderCount = Object.keys(orderGroup).length;
  const wishCount = Object.keys(wishLists).length;
  const myReviewCount = Object.keys(myReviewList).length;
  const myaddressCount = Object.keys(addressList).length;

  return (
    <div className="my-profile-page">
      <div className="my-profile-page-title">
        <span>My Page</span>
      </div>
      <div className="short-my-profile">
        <div className="profile-container">
          <div className="profile-image-container">
            <img src={profileImageUrl} alt="프로필 이미지" className="" />
          </div>
          <div className="name-joined-container">
            <div className="profile-info-container">
              <div className="profile-info larze-font-size-and-weight">
                <span className="larze-font-size-and-weight">{nickname}</span>
              </div>
            </div>
            <div className="profile-info-container">
              <div className="profile-info middle-font-size-and-weight">
                <span>{memberRole}</span>
                <span
                  className="small-font-size-and-weight ml-5"
                  style={{ color: "yellow" }}
                >
                  가입일 : {joinedAt}
                </span>
              </div>
            </div>
            <div className="profile-info-container">
              <div className="profile-info middle-font-size-and-weight">
                <span className="small-font-size-and-weight">
                  <Link
                    to="/user/mypage/update-info"
                    style={{ color: "yellow" }}
                  >
                    {`회원 정보 변경`}
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="my-page-links-list-container">
            <div className="my-page-links-card">
              <Link to="/user/mypage/my-wish-list">
                <div className="my-page-link">
                  <img src="https://i.ibb.co/mt24J8Z/22.png"></img>
                  <span>찜 목록</span>
                  <span>{wishCount}</span>
                </div>
              </Link>
            </div>
            <div className="my-page-links-card">
              <Link to="/user/mypage/payment-history">
                <div className="my-page-link">
                  <img src="https://i.ibb.co/KFHz9ym/55.png"></img>
                  <span>결제 내역</span>
                  <span>{orderCount}</span>
                </div>
              </Link>
            </div>
            <div className="my-page-links-card">
              <Link to="/user/mypage/my-review">
                <div className="my-page-link">
                  <img src="https://i.ibb.co/JCTvJky/33.png"></img>
                  <span>구매 후기</span>
                  <span>{myReviewCount}</span>
                </div>
              </Link>
            </div>
            <div className="my-page-links-card">
              <Link to="/user/mypage/address">
                <div className="my-page-link">
                  <img src="https://i.ibb.co/4Ky0LVX/44.png"></img>
                  <span>배송 목록</span>
                  <span>{myaddressCount}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MyProfilePage };
