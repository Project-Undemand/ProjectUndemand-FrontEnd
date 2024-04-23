import React from "react";
import { Link } from "react-router-dom";
import "./MyProfilePage.css";
// import { FaRegStar, FaStar } from "react-icons/fa6";

function MyProfilePage({ setSelectedPage }) {
  // 별점 생성 함수
  // const renderStars = (rating) => {
  //   const filledStars = Math.floor(rating);
  //   const remainingStars = 5 - filledStars;

  //   return (
  //     <>
  //       {[...Array(filledStars)].map((_, index) => (
  //         <FaStar key={index} />
  //       ))}
  //       {[...Array(remainingStars)].map((_, index) => (
  //         <FaRegStar key={filledStars + index} />
  //       ))}
  //     </>
  //   );
  // };

  return (
    <div className="my-profile-page">
      <div className="my-profile-page-title">
        <span>프로필</span>
      </div>
      <div className="short-my-profile">
        <div className="profile-container">
          <img src="" alt="" />
          <div className="name-joined-container">
            <span className="user-name-info">{`회원 이름`}</span>
            <span className="user-joined-date-info">{`PU멤버 가입: 가입 일자`}</span>
            <Link to="/user/mypage/update-user-info">{`회원정보 수정`}</Link>
          </div>
        </div>
      </div>
      <div className="short-payment-history">
        <div className="sph-title">
          <span>최근 주문한 상품</span>
          <span>
            <Link to="/user/mypage/payment-history">더 보기</Link>
          </span>
        </div>
        <div className="sph-card-container">
          <div className="sph-card">
            <img src="" alt="" />
            <div className="sph-card-text">
              <span>{`상품 이름`}</span>
            </div>
          </div>
          <div className="sph-card">
            <img src="" alt="" />
            <div className="sph-card-text">
              <span>{`상품 이름`}</span>
            </div>
          </div>
          <div className="sph-card">
            <img src="" alt="" />
            <div className="sph-card-text">
              <span>{`상품 이름`}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="short-wish-list">
        <div className="swl-title">
          <span>찜한 상품</span>
          <span>
            <Link to="/user/mypage/wish-list">더 보기</Link>
          </span>
        </div>
        <div className="swl-card-container">
          <div className="sph-card">
            <img src="" alt="" />
            <div className="sph-card-text">
              <span>{`상품 이름`}</span>
            </div>
          </div>
          <div className="sph-card">
            <img src="" alt="" />
            <div className="sph-card-text">
              <span>{`상품 이름`}</span>
            </div>
          </div>
          <div className="sph-card">
            <img src="" alt="" />
            <div className="sph-card-text">
              <span>{`상품 이름`}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="short-my-review">
        <div className="smr-title">
          <span>내 리뷰</span>
          <span>
            <Link to="/user/mypage/my-review">더 보기</Link>
          </span>
        </div>
        <div className="smr-card-container">
          <div className="review-container">
            <div className="review-product">
              <img src={``} alt={``} />
              <div className="txt-info">
                <span>{`상품 이름`}</span>
              </div>
            </div>
            <div className="review-main-content-container">
              <div className="rating-box">
                <div className="star-rate">{`renderStars(userReviewData.rating)`}</div>
              </div>
              <div className="review-box">
                <div className="my-review-content">
                  {`userReviewData.reviewContent`}
                </div>
              </div>
              <img src={``} alt={``} />
            </div>
            <div className="review-edit-del-container">
              <div className="review-date">
                <span>작성일:</span>
                {`userReviewData.createdAt.substring(0, 10)`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MyProfilePage };