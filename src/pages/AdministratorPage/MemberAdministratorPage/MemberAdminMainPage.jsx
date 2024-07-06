import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// CSS
import "./MemberAdminMainPage.css";
import { MenuItem } from "./MemberAdminComponent.jsx";

function MemberAdminMainPage({ profileData, profileImageUrl }) {
  const [currentTime, setCurrentTime] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState("overview");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    // 초기 시간 설정
    updateTime();

    // 1분마다 시간 업데이트
    const intervalId = setInterval(updateTime, 60000);

    // 컴포넌트가 언마운트될 때 인터벌 클리어
    return () => clearInterval(intervalId);
  }, []);

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  console.log(profileData);
  const email = profileData?.member?.email || "이메일";
  const username = profileData?.member?.username;
  const nickname = profileData?.member?.nickname;
  const memberAges = profileData?.memberAges || "성별";
  const memberGender = profileData?.memberGender || "연령대";
  const memberRole =
    profileData?.member?.member_role === "ADMIN"
      ? "관리자"
      : profileData?.member?.member_role === "SELLER"
      ? "판매자"
      : "일반";

  const joinedAt =
    profileData?.member?.joined_at.substring(0, 10) || "가입날짜";
  const last_logged_in_date =
    profileData?.member?.last_logged_in_date.substring(0, 10) ||
    "최근로그인날짜";
  const daysWithUs = calculateDaysWithUs(joinedAt, last_logged_in_date);

  function calculateDaysWithUs(joinedDate, lastLoginDate) {
    if (joinedDate === "가입날짜" || lastLoginDate === "최근로그인날짜") {
      return "N/A";
    }

    const joined = new Date(joinedDate);
    const lastLogin = new Date(lastLoginDate);
    // 날짜에 하루를 추가
    joined.setDate(joined.getDate());
    lastLogin.setDate(lastLogin.getDate() + 1);
    // 가입 날짜와 최근 로그인 날짜를 계산.
    const diffTime = Math.abs(lastLogin - joined);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일수로 변환

    return diffDays + " Days";
  }

  return (
    // 전체 페이지
    <div className="admin-page">
      {/* 백오피스 전체 그리드 */}
      <div className="admin-container">
        <div className="admin-header-container">
          <div className="odd-logo-box">
            <Link to={`/admin/members`}>
              <img
                src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F87054c14-3045-487d-82bf-e67e1fad8c91%2F1ee1c86b-c5df-4413-a7c8-4064ddedf9aa%2F7.png?table=block&id=9e99d5e3-a722-47f2-9ee5-543e98cf41b2&spaceId=87054c14-3045-487d-82bf-e67e1fad8c91&width=250&userId=d437ba1e-2db9-47c8-a971-6e6c38bff1f7&cache=v2"
                alt="odd-main-logo"
                className="odd-main-logo"
                style={{ width: "60px", height: "60px" }}
              />
              <span>ODD Shop</span>
            </Link>
          </div>
          <div className="search-filter-box"></div>
          <div class="notification-setting-container">
            <div className="notification-box">
              <Link to={`/admin/members`}>
                <img
                  src="https://i.ibb.co/wcsRRh2/1.png"
                  alt="notification-image"
                  className="notification-image"
                  style={{ width: "30px", height: "30px" }}
                />
              </Link>
            </div>
            <div className="setting-box">
              <Link to={`/admin/members`}>
                <img
                  src="https://i.ibb.co/JmtTJmz/setting.png"
                  alt="notification-image"
                  className="notification-image"
                  style={{ width: "30px", height: "30px" }}
                />
              </Link>
            </div>
            <div className="current-time-box">
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
        <div className="admin-content-container">
          <div className="content-left">
            <div className="menu-top">Main Menu</div>
            <ul>
              <MenuItem
                to={``}
                iconSrc="https://i.ibb.co/cNwHfBJ/analysis.png"
                text="전체 개요"
                active={activeMenuItem === "overview"}
                onClick={() => handleMenuItemClick("overview")}
              />
              <MenuItem
                to={``}
                iconSrc="https://i.ibb.co/9qL0M3w/people.png"
                text="회원 관리"
                active={activeMenuItem === "member"}
                onClick={() => handleMenuItemClick("member")}
              />
              <MenuItem
                to={``}
                iconSrc="https://i.ibb.co/zX5qfsF/invoice.png"
                text="결제 관리"
                active={activeMenuItem === "payment"}
                onClick={() => handleMenuItemClick("payment")}
              />
              <MenuItem
                to={``}
                iconSrc="https://i.ibb.co/r3THbnG/admin.png"
                text="관리자 전용"
                active={activeMenuItem === "admin"}
                onClick={() => handleMenuItemClick("admin")}
              />
              <MenuItem
                to={``}
                iconSrc="https://i.ibb.co/KrTP8zh/seller.png"
                text="판매자 전용"
                active={activeMenuItem === "seller"}
                onClick={() => handleMenuItemClick("seller")}
              />
              <MenuItem
                to={``}
                iconSrc="https://i.ibb.co/pPXW7Y4/tshirt.png"
                text="상품 관리"
                active={activeMenuItem === "product"}
                onClick={() => handleMenuItemClick("product")}
              />
            </ul>
          </div>
          <div className="content-middle">
            <div className="admin-contents-container">
              <div className="admin-feature-intro">
                <div className="admin-feature-intro-title">
                  <h2>
                    {memberRole} {username || nickname || ""}님 반갑습니다 !
                  </h2>
                  <button
                    className="admin-feature-intro-close-button"
                    onClick={() =>
                      (document.querySelector(
                        ".admin-feature-intro"
                      ).style.display = "none")
                    }
                  >
                    <img
                      src="https://i.ibb.co/RSJVmzf/close.png"
                      alt="Close"
                      className="admin-feature-intro-close-icon"
                    />
                  </button>
                </div>
                <div className="admin-feature-intro-content">
                  <span>
                    ODD 의 관리자 페이지에서는, 재고 관리, 상품 관리, 전체 회원
                    관리
                  </span>
                  <span>
                    판매자와 관리자를 위한 데이터 분석 및 보고 등을 제공하고
                    있습니다.
                  </span>
                  <span style={{ marginTop: "20px", fontWeight: "normal" }}>
                    On-demand Shop, PU Team . July 2024
                  </span>
                </div>
              </div>
            </div>
            <div className="admin-contents-container">
              <div className=""></div>
            </div>
            <div className="admin-contents-container"></div>
          </div>
          <div className="content-right">
            <div className="admin-page-profile-container">
              <div className="admin-page-profile-image-box">
                <div className="profile-image-card">
                  <img src={profileImageUrl}></img>
                </div>
                <div className="profile-name-card">
                  <h3>
                    {profileData.member?.username ||
                      profileData.member?.nickname ||
                      "회원이름"}
                  </h3>
                  <div className="member-short-info">
                    <span className="member-short-info-role">{memberRole}</span>
                    <span className="member-short-info-lastdate">
                      - {daysWithUs}
                    </span>
                  </div>
                </div>
                <div className="profile-btn-card">
                  <button className="more-about-profile-btn">
                    <img
                      src="https://i.ibb.co/gPNJh1r/dots.png"
                      className="more-about-profile-btn-img"
                    ></img>
                  </button>
                </div>
              </div>
              <div className="profile-intro-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MemberAdminMainPage };

/*
https://i.ibb.co/pPXW7Y4/tshirt.png
https://i.ibb.co/9qL0M3w/people.png
https://i.ibb.co/zX5qfsF/invoice.png

https://i.ibb.co/4JjNMqv/addresshome.png
https://i.ibb.co/cNwHfBJ/analysis.png
https://i.ibb.co/sypJkLQ/business-intelligence.png
https://i.ibb.co/3v1dVPB/digital-product.png
https://i.ibb.co/FWx044n/stats.png
https://i.ibb.co/M6wgTGs/furniture.png
https://i.ibb.co/SdcCwBm/reviews.png

https://i.ibb.co/wcsRRh2/1.png
https://i.ibb.co/x7GsT5P/2.png
https://i.ibb.co/JmtTJmz/setting.png

https://i.ibb.co/gPNJh1r/dots.png
https://i.ibb.co/r3THbnG/admin.png
https://i.ibb.co/KrTP8zh/seller.png
*/
