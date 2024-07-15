import React, { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// CSS
import "./MemberAdminMainPage.css";
import { MenuItem } from "./MemberAdminComponent.jsx";
import { OverviewDashboard } from "./MemberManagementPages/OverviewDashboard.jsx";
import { MemberManagementPage } from "./MemberManagementPages/MemberManagementPage.jsx";
import { PaymentManagementPage } from "./MemberManagementPages/PaymentManagementPage.jsx";
import { ProductManagementPage } from "./MemberManagementPages/ProductManagementPage.jsx";
import { calculateDaysWithUs } from "./MemberAdminApiUtil.jsx";

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

  const email = profileData?.member?.email || "이메일";
  const username = profileData?.member?.username || "회원이름";
  const nickname = profileData?.member?.nickname || "닉네임";
  const memberAges = profileData?.memberAges || "성별";
  const memberGender = profileData?.memberGender || "연령대";
  const memberRole =
    profileData?.member?.member_role === "ADMIN"
      ? "관리자"
      : profileData?.member?.member_role === "SELLER"
      ? "판매자"
      : "일반";

  const joinedAt =
    profileData?.member?.joined_at?.substring(0, 10) || "가입날짜";
  const last_logged_in_date =
    profileData?.member?.last_logged_in_date?.substring(0, 10) ||
    "최근로그인날짜";
  const daysWithUs = calculateDaysWithUs(joinedAt, last_logged_in_date);

  if (!profileData) {
    return <div>Loading...</div>; // 혹은 적절한 로딩 컴포넌트나 메시지
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
              <Link to={`/admin/members/overview`}>
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
                link="/admin/members/overview"
                iconSrc="https://i.ibb.co/cNwHfBJ/analysis.png"
                text="전체 개요"
                active={location.pathname === "/admin/members/overview"}
              />
              <MenuItem
                link="/admin/members/member-manage"
                iconSrc="https://i.ibb.co/9qL0M3w/people.png"
                text="회원 관리"
                active={location.pathname === "/admin/members/member-manage"}
              />
              <MenuItem
                link="/admin/members/payment-manage"
                iconSrc="https://i.ibb.co/zX5qfsF/invoice.png"
                text="결제 관리"
                active={location.pathname === "/admin/members/payment-manage"}
              />
              <MenuItem
                link="/admin/members/product-manage"
                iconSrc="https://i.ibb.co/pPXW7Y4/tshirt.png"
                text="상품 관리"
                active={location.pathname === "/admin/members/product-manage"}
              />
              {/* <MenuItem
                to={`/admin/members`}
                iconSrc="https://i.ibb.co/r3THbnG/admin.png"
                text="관리자 전용"
                active={activeMenuItem === "admin"}
                onClick={() => handleMenuItemClick("admin")}
              />
              <MenuItem
                to={`/admin/members`}
                iconSrc="https://i.ibb.co/KrTP8zh/seller.png"
                text="판매자 전용"
                active={activeMenuItem === "seller"}
                onClick={() => handleMenuItemClick("seller")}
              /> */}
            </ul>
          </div>
          <Routes>
            <Route
              path="/overview"
              element={<OverviewDashboard profileData={profileData} />}
            />
            <Route
              path="/member-manage"
              element={<MemberManagementPage profileData={profileData} />}
            />
            <Route
              path="/payment-manage"
              element={<PaymentManagementPage profileData={profileData} />}
            />
            <Route
              path="/product-manage"
              element={<ProductManagementPage profileData={profileData} />}
            />
          </Routes>
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
