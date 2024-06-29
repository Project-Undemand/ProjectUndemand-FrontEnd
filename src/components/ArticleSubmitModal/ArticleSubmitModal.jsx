import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ArticleSubmitModal.css";
import { MdClose } from "react-icons/md";
import { FaRegStar, FaStar } from "react-icons/fa6";
import swal from "sweetalert";
import axios from "axios";

function ArticleSubmitModal({
  modalType,
  modalClose,
  paymentHistories,
  product,
  updateReviewData,
  updateinquiryData,
  isLoggedin,
  memberId,
}) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [writer, setWriter] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [inquiryTitle, setInquiryTitle] = useState("");
  const [inquiryPassword, setInquiryPassword] = useState("");
  const [inquiryCategory, setInquiryCategory] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const { productId } = useParams();

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleReviewSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("reviewContent", reviewContent);
      formData.append("rating", rating);
      formData.append("images", imageFile);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/review/new/${paymentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      swal({
        title: `"${
          userName ? userName : response.data.writer
        }" 님의 리뷰를 등록하였습니다.`,
      }).then(() => {
        modalClose();
      });
      updateReviewData();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleReviewSubmitBtn = async () => {
    if (paymentId && reviewContent && rating) {
      await handleReviewSubmit();
    } else {
      swal({
        title: "모든 입력란을 작성해 주세요!",
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/profile/${memberId}`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
            withCredentials: true,
          }
        );
        setUserName(response.data.member.username);
        setUserEmail(response.data.member.email);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    if (memberId) {
      fetchUserData();
    } else {
      return;
    }
  }, [memberId]);

  const handleInquirySubmit = async () => {
    let requestData = {
      inquiryContent: inquiryContent,
      inquiryTitle: inquiryTitle,
      password: inquiryPassword,
      inquiryType: inquiryCategory,
    };

    if (isLoggedin) {
      requestData = {
        ...requestData,
        name: userName,
        email: userEmail,
      };
    } else {
      requestData = {
        ...requestData,
        name: writer,
        email: email,
      };
    }

    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/inquiry/new/${productId}`,
        requestData,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        swal({
          title: `"${
            userName ? userName : writer
          }" 님의 문의 글을 등록하였습니다.`,
        }).then(() => {
          modalClose();
        });
        updateinquiryData();
      })
      .catch((error) => {
        console.error("요청을 보내는 중 오류가 발생했습니다:", error);
      });
  };

  const handleCategoryBtnClick = (category) => {
    setInquiryCategory(category);
  };

  const handleInquirySubmitBtn = async () => {
    if (isLoggedin) {
      if (
        inquiryContent &&
        inquiryTitle &&
        inquiryCategory &&
        inquiryPassword
      ) {
        await handleInquirySubmit();
      } else {
        swal({
          title: "모든 입력란을 작성해 주세요!",
        });
      }
    } else if (!isLoggedin) {
      if (
        writer &&
        email &&
        inquiryContent &&
        inquiryTitle &&
        inquiryCategory &&
        inquiryPassword
      ) {
        await handleInquirySubmit();
      } else {
        swal({
          title: "모든 입력란을 작성해 주세요!",
        });
      }
    }
  };

  return (
    <div className="article-submit-modal">
      {modalType === "review" ? (
        <div className={`review-writing-modal`}>
          <div className="modal-top-section">
            <h2>리뷰 작성</h2>
            <h3>상품에 대한 리뷰를 작성해 주세요</h3>
            <div className="review-writing-modal-product-info">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2124&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="review-writing-modal-img-info"
              />
              <span>{product.productName}</span>
            </div>
            <MdClose
              onClick={modalClose}
              className="close-review-writing-modal"
            />
          </div>
          <div className="modal-content-section">
            <div className="review-option-select">
              <span>리뷰를 남길 상품 옵션 선택</span>
              <select
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
              >
                <option value="">리뷰를 남길 옵션을 선택해 주세요.</option>
                {paymentHistories.map((paymentHistory) => (
                  <option
                    key={paymentHistory.paymentId}
                    value={paymentHistory.paymentId}
                  >
                    {paymentHistory.option}
                  </option>
                ))}
              </select>
            </div>
            <div className="review-rate">
              <span>평점</span>
              <div className="review-rate-input">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    onClick={() => setRating(index + 1)}
                    style={{ cursor: "pointer" }}
                  >
                    {index < rating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
            </div>
            <div className="review-writing">
              <div className="review-content">
                <span>내 리뷰</span>
                <div className="content-input-cover">
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="review-img">
              <span>이미지 등록</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="review-btn-box">
              <button
                className="submit-btn"
                onClick={() => handleReviewSubmitBtn()}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`inquiry-writing-modal`}>
          <div className="modal-top-section">
            <h2>문의 글 작성</h2>
            <h3>제품에 대한 문의 사항을 작성해 주세요</h3>
            <div className="review-writing-modal-product-info">
              <Link to={`/product/${product.productId}`}>
                {`상품 이름: ${product.productName}`}
              </Link>
            </div>
            <MdClose
              onClick={modalClose}
              className="close-review-writing-modal"
            />
          </div>
          <div className="modal-content-section">
            {isLoggedin === false && (
              <div className="writer-info">
                <span className="first-label">작성자</span>
                <div className="input-cover">
                  <input
                    type="text"
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                    placeholder="ex) 홍길동"
                  />
                </div>
                <span className="last-label">이메일</span>
                <div className="input-cover">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex) gildong@gmail.com"
                  />
                </div>
              </div>
            )}
            <div className="inquiry-writing">
              <span className="first-label">내 문의 글</span>
              <div className="content-input-cover">
                <textarea
                  value={inquiryContent}
                  onChange={(e) => setInquiryContent(e.target.value)}
                />
              </div>
              <span className="last-label">문의 글 제목</span>
              <div className="title-input-cover">
                <input
                  type="text"
                  value={inquiryTitle}
                  onChange={(e) => setInquiryTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="inquiry-category-select">
              <span className="first-label">문의 카테고리</span>
              <div className="category-button-box">
                <button
                  onClick={() => handleCategoryBtnClick("PRODUCT")}
                  className={inquiryCategory === "PRODUCT" ? "active" : ""}
                >
                  상품 문의 글
                </button>
                <button
                  onClick={() => handleCategoryBtnClick("DELIVERY")}
                  className={inquiryCategory === "DELIVERY" ? "active" : ""}
                >
                  배송 문의 글
                </button>
                <button
                  onClick={() => handleCategoryBtnClick("EXCHANGE")}
                  className={inquiryCategory === "EXCHANGE" ? "active" : ""}
                >
                  교환 문의 글
                </button>
                <button
                  onClick={() => handleCategoryBtnClick("RETURN")}
                  className={inquiryCategory === "RETURN" ? "active" : ""}
                >
                  반품 문의 글
                </button>
                <button
                  onClick={() => handleCategoryBtnClick("REFUND")}
                  className={inquiryCategory === "REFUND" ? "active" : ""}
                >
                  취소 문의 글
                </button>
                <button
                  onClick={() => handleCategoryBtnClick("ETC")}
                  className={inquiryCategory === "ETC" ? "active" : ""}
                >
                  기타 문의 글
                </button>
              </div>
            </div>
            <div className="additional-info">
              <span className="first-label">문의 글 비밀 번호</span>
              <div className="input-cover">
                <input
                  type="password"
                  value={inquiryPassword}
                  onChange={(e) => setInquiryPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="inquiry-btn-box">
              <button
                className="submit-btn"
                onClick={() => handleInquirySubmitBtn()}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleSubmitModal;
