import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa6";
// 외부 라이브러리 및 모듈
import axios from "axios";
import swal from "sweetalert";
// 컴포넌트 & CSS
import ReviewUpdateModal from "../../components/ReviewUpdateModal/ReviewUpdateModal";
import "./MyReviewPage.css";

function MyReviewPage({ isLoggedin, memberId }) {
  const [selectedReviewSortOption, setSelectedReviewSortOption] =
    useState("최신순");
  const [selectedInquirySortOption, setSelectedInquirySortOption] =
    useState("최신순");
  const [sortOptionClick, setSortOptionClick] = useState(false);
  const [selectedReviewFilterOption, setSelectedReviewFilterOption] =
    useState("평점");
  const [selectedInquiryFilterOption, setSelectedInquiryFilterOption] =
    useState("전체 보기");
  const [filterOptionClick, setFilterOptionClick] = useState(false);
  const [productReviewData, setProductReviewData] = useState([]);
  const [rUModalOpen, setRUModalOpen] = useState(false);
  const [selectedRId, setSelectedRId] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);

  const [isImagesChecked, setIsImagesChecked] = useState(false);
  const defaultImageURL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTRx9zMfm7p_YRHoXXLVhaI2YpE4bMGgwnyg&s";

  useEffect(() => {
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
        setProductReviewData(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    fetchProductReviewData();
  }, [memberId]);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const thumbnailPromises = productReviewData.map(async (userReview) => {
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
  }, [productReviewData]);

  useEffect(() => {
    const checkImages = async () => {
      const updatedReviewData = await Promise.all(
        productReviewData.map(async (review) => {
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
      setProductReviewData(updatedReviewData);
      setIsImagesChecked(true); // 이미지 상태 확인 완료
    };
    if (productReviewData.length > 0 && !isImagesChecked) {
      checkImages();
    }
  }, [productReviewData, isImagesChecked]);

  const handleRUModalOpen = async (reviewId) => {
    setRUModalOpen(true);
    setSelectedRId(reviewId);
  };

  const closeRUModal = () => {
    setRUModalOpen(false);
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
      <div className="review-page-title-container">
        <div className="review-page-title">내 리뷰</div>
        <div className="total-review-count">{`(${productReviewData.length}개의 리뷰)`}</div>
      </div>
      <div className="review-page-filter">
        <div className="review-sort-box">
          <div
            className="selected-sort-option"
            onClick={() => setSortOptionClick((prevState) => !prevState)}
          >{`정렬: ${selectedReviewSortOption}`}</div>
          <ul
            className={`review-sort-option ${sortOptionClick && "drop-option"}`}
          >
            <li>최신순</li>
            <li>오래된순</li>
            <li>높은 평점순</li>
            <li>낮은 평점순</li>
          </ul>
        </div>
        <div className="review-search-option"></div>
        <div className="review-filter-box">
          <div
            className="selected-filter-option"
            onClick={() => setFilterOptionClick((prevState) => !prevState)}
          >{`필터: ${selectedReviewFilterOption}`}</div>
          <ul
            className={`review-filter-option ${
              filterOptionClick && "drop-option"
            }`}
          >
            <li>{`별별별별별 (7)`}</li>
            <li>{`별별별별 (3)`}</li>
            <li>{`별별별 (0)`}</li>
            <li>{`별별 (0)`}</li>
            <li>{`별 (0)`}</li>
          </ul>
        </div>
      </div>
      {productReviewData && productReviewData.length > 0 ? (
        productReviewData.map((tableRow, index) => {
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
                          />
                          {/* <img
                            src={imgPath}
                            alt={`상품명 ${
                              tableRow.productName
                            }의 ${index}번 리뷰 이미지 ${imgIndex + 1}`}
                            className="preview-image"
                          /> */}
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
          updateReviewData={productReviewData}
        ></ReviewUpdateModal>
      )}
    </div>
  );
}

export { MyReviewPage };
