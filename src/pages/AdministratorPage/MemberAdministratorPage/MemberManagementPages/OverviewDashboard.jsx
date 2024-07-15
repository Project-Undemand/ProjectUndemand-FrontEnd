function OverviewDashboard({ profileData }) {
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

  return (
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
                (document.querySelector(".admin-feature-intro").style.display =
                  "none")
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
              ODD 의 관리자 페이지에서는, 재고 관리, 상품 관리, 전체 회원 관리
            </span>
            <span>
              판매자와 관리자를 위한 데이터 분석 및 보고 등을 제공하고 있습니다.
            </span>
            <span style={{ marginTop: "20px", fontWeight: "normal" }}>
              On-demand Shop, PU Team . July 2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { OverviewDashboard };
