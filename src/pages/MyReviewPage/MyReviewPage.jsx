import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
// 외부 라이브러리 및 모듈
import axios from "axios";
import swal from "sweetalert";
// 컴포넌트 & CSS
import { setMyReviewList } from "../../store";
import ReviewUpdateModal from "../../components/ReviewUpdateModal/ReviewUpdateModal";
import { MyProfilePage } from "../MyProfilePage/MyProfilePage.jsx";
import "./MyReviewPage.css";

function MyReviewPage({ isLoggedin, memberId, profileData, profileImageUrl }) {
  const dispatch = useDispatch(); // Redux 디스패치 훅

  const [rUModalOpen, setRUModalOpen] = useState(false);
  const [selectedRId, setSelectedRId] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);

  const [isImagesChecked, setIsImagesChecked] = useState(false);
  const defaultImageURL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTRx9zMfm7p_YRHoXXLVhaI2YpE4bMGgwnyg&s";

  const myReviewList = useSelector((state) => state.myReviewList) || [];
  const reviewCount = Object.keys(myReviewList).length;

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (!Array.isArray(myReviewList) || myReviewList.length === 0) return;

      try {
        const thumbnailPromises = myReviewList.map(async (userReview) => {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/thumbnail/${userReview.productId}`,
            {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
              },
              withCredentials: true,
            }
          );
          return response.data[0];
        });
        const thumbnailData = await Promise.all(thumbnailPromises);
        setThumbnailImages(thumbnailData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchThumbnail();
  }, [myReviewList]);

  useEffect(() => {
    console.log(myReviewList);
    const checkImages = async () => {
      if (!Array.isArray(myReviewList)) {
        return;
      }

      const updatedReviewData = await Promise.all(
        myReviewList.map(async (review) => {
          const updatedImgPaths = await Promise.all(
            review.reviewImgPaths.slice(0, 5).map(async (imgPath) => {
              const url = `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${imgPath}`;
              try {
                const response = await axios.head(url);
                return response.status === 200 ? url : defaultImageURL;
              } catch (error) {
                return defaultImageURL;
              }
            })
          );
          return { ...review, reviewImgPaths: updatedImgPaths };
        })
      );
      dispatch(setMyReviewList(updatedReviewData)); // Redux 액션 디스패치
      setIsImagesChecked(true); // 이미지 상태 확인 완료
    };

    if (!isImagesChecked) {
      checkImages();
    }
  }, [isImagesChecked]); // 의존성 배열에서 productReviewData 제거

  const handleRUModalOpen = async (reviewId) => {
    setRUModalOpen(true);
    setSelectedRId(reviewId);
  };

  const closeRUModal = () => {
    setRUModalOpen(false);
  };

  const handleImageClick = (imgPath) => {
    const imgElement = document.createElement("img");
    imgElement.src = imgPath;
    imgElement.alt = "Review Image";
    imgElement.className = "swal-content__img"; // 클래스 네임 설정

    swal({
      content: imgElement,
    });
  };

  const handleReviewDelete = async (reviewId) => {
    swal({
      title: "리뷰 삭제",
      text: "삭제 후 복구나 재등록이 불가능합니다. 정말 삭제하시겠습니까?",
      icon: "warning",
      buttons: ["아니오", "예"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const authorization = localStorage.getItem("Authorization");
          await axios.delete(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/review/${reviewId}/${memberId}`,
            {
              headers: {
                Authorization: authorization,
              },
              withCredentials: true,
            }
          );
          setProductReviewData((prevData) =>
            prevData.filter((review) => review.reviewId !== reviewId)
          );
          swal("리뷰가 성공적으로 삭제되었습니다.", {
            icon: "success",
          });
        } catch (error) {
          console.error(error.response.data);
          swal("리뷰 삭제 중 오류가 발생했습니다.", {
            icon: "error",
          });
        }
      } else {
        swal.close(); // '아니오' 버튼을 누르면 창을 닫습니다.
      }
    });
  };

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const remainingStars = 5 - filledStars;

    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <FaStar key={index} />
        ))}
        {[...Array(remainingStars)].map((_, index) => (
          <FaRegStar key={filledStars + index} />
        ))}
      </>
    );
  };

  return (
    <div className="review-page">
      <MyProfilePage
        isLoggedin={isLoggedin}
        memberId={memberId}
        profileData={profileData}
        profileImageUrl={profileImageUrl}
      />
      <div className="review-page-title-container">
        <div className="review-page-title">내 리뷰</div>
        <div className="total-review-count">{`(${reviewCount}개의 리뷰)`}</div>
      </div>
      {myReviewList && myReviewList.length > 0 ? (
        myReviewList.map((tableRow, index) => {
          return (
            <div key={tableRow.reviewId} className="review-container">
              <div className="review-product">
                {thumbnailImages[index] ? (
                  <Link to={`/product/${tableRow.productId}`}>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${thumbnailImages[index]}`}
                      alt={`상품명: ${tableRow.productName}`}
                      className="review-product-img"
                    />
                  </Link>
                ) : (
                  <div>이미지 로딩 중...</div>
                )}
                <div className="txt-info">
                  <span>{tableRow.productName}</span>
                </div>
              </div>
              <div className="review-main-content-container">
                <div className="rating-box">
                  <div className="star-rate">
                    {renderStars(tableRow.rating)}
                  </div>
                </div>
                <div className="review-box">
                  <div className="my-review-content">
                    {tableRow.reviewContent}
                  </div>
                </div>
                <div className="review-images-wrapper">
                  <div className="review-images">
                    {tableRow.reviewImgPaths
                      .slice(0, 5)
                      .map((imgPath, imgIndex) => (
                        <div key={imgIndex} className="review-image-container">
                          <img
                            src={imgPath}
                            alt={`상품명 ${
                              tableRow.productName
                            }의 ${index}번 리뷰 이미지 ${imgIndex + 1}`}
                            className="review-image"
                            onClick={() => handleImageClick(imgPath)} // 이미지 클릭 핸들러 추가
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="review-edit-del-container">
                <div className="review-date">
                  <span>마지막 수정일:</span>
                  {tableRow.updatedAt.substring(0, 10)}
                </div>
                <div className="review-edit-del">
                  <button onClick={() => handleRUModalOpen(tableRow.reviewId)}>
                    리뷰 수정
                  </button>
                  <button onClick={() => handleReviewDelete(tableRow.reviewId)}>
                    리뷰 삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>리뷰가 아직 작성되지 않았습니다.</div>
      )}
      {rUModalOpen && (
        <ReviewUpdateModal
          reviewId={selectedRId}
          memberId={memberId}
          modalClose={closeRUModal}
          updateReviewData={myReviewList}
        ></ReviewUpdateModal>
      )}
    </div>
  );
}

export { MyReviewPage };
