import React from "react";
import { Link } from "react-router-dom";
import "./MyProfilePage.css";

function MyProfilePage({ isLoggedin, memberId, profileData, profileImageUrl }) {
  const email = profileData?.member?.email || "없음";
  const username = profileData?.member?.username || "없음";
  const nickname = profileData?.member?.nickname || "없음";
  const memberAges = profileData?.memberAges || "없음";
  const memberGender = profileData?.memberGender || "없음";
  const joinedAt = profileData?.member?.joined_at.substring(0, 10) || "없음";

  return (
    <div className="my-profile-page">
      <div className="my-profile-page-title">
        <span>My Profile</span>
      </div>
      <div className="short-my-profile">
        <div className="profile-container">
          <div className="profile-image-container">
            <img
              src={profileImageUrl}
              alt="프로필 이미지"
              className="profile-image"
            />
          </div>
          <div className="name-joined-container">
            <div className="profile-info-container">
              <div className="profile-info profile-font-size-and-weight">
                <span>이름</span>
                <span>{username}</span>
              </div>
            </div>
            <div className="profile-info-container">
              <div className="profile-info profile-font-size-and-weight">
                <span>이메일</span>
                <span>{email}</span>
              </div>
            </div>
            <div className="profile-info-container">
              <div className="profile-info profile-font-size-and-weight">
                <span>닉네임</span>
                <span>{nickname}</span>
              </div>
            </div>
            <div className="profile-info-container">
              <div className="profile-info profile-font-size-and-weight">
                <span>성별</span>
                <span>{memberGender}</span>
              </div>
            </div>
            <div className="profile-info-container">
              <div className="profile-info profile-font-size-and-weight">
                <span>연령대</span>
                <span>{memberAges}</span>
              </div>
            </div>
            <div className="profile-info-container">
              <div className="profile-info profile-font-size-and-weight">
                <span>회원가입 날짜</span>
                <span>{joinedAt}</span>
              </div>
            </div>
            <br />
            <div className="profile-navi-page">
              <Link to="/user/mypage/update-info">{`수정하기`}</Link>
              {/* <Link to="/user/mypage/profile-detail">{`상세보기`}</Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MyProfilePage };
