import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import swal from "sweetalert";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { adjustImageSize } from "../ReactImageCropper/ImageUtil.jsx";
import { fetchPaymentHistory } from "../../pages/MyPage/MyPageApiUtils.jsx";

function ReviewModal({
  memberId,
  isOpen,
  onClose,
  orderId,
  orderGroup,
  setLocalOrderGroup,
  setProductInventory,
}) {
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const defalteReviewImage =
    "https://image.ohou.se/i/bucketplace-v2-development/uploads/productions/1557828582299_MBRS6Sprm8.gif?gif=1&w=72&h=72&c=c";
  const FileSelectButtonImage = "https://i.ibb.co/YLpZQGg/png.png";

  const fileInputRef = useRef(null);

  // Number of placeholders to add
  const placeholdersNeeded = 5 - imagePreviews.length;
  const placeholderArray = Array(placeholdersNeeded).fill(defalteReviewImage);

  // Combine uploaded images with placeholders
  const displayImages = [...imagePreviews, ...placeholderArray];

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const qualityStep = 0.1; // 품질 감소 단계

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleReviewContentChange = (e) => {
    setReviewContent(e.target.value);
  };

  const handleImageChange = async (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length + images.length > 5) {
      swal("이미지는 최대 5개까지 업로드할 수 있습니다.");
      return;
    }

    const newImages = [];
    const newImagePreviews = [];

    for (const file of newFiles) {
      const adjustedImage = await adjustImageSize(file);
      newImages.push(adjustedImage);

      console.log("Adjusted image size:", adjustedImage.size);

      const previewUrl = URL.createObjectURL(adjustedImage);
      newImagePreviews.push(previewUrl);
    }

    setImages((prevImages) => [...prevImages, ...newImages]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };

  const handleReviewSubmit = async () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("reviewContent", reviewContent);
    images.forEach((image) => {
      formData.append("images", image); // images라는 키값으로 설정
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/review/new/${paymentId}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      swal("리뷰가 성공적으로 작성되었습니다.");
      onClose();
      fetchPaymentHistory(
        dispatch,
        memberId,
        setLocalOrderGroup,
        setProductInventory
      ); // 구매 후기를 작성한 후 결제 내역을 다시 불러옵니다.
    } catch (error) {
      console.error("리뷰 작성 중 오류가 발생했습니다:", error);
      swal("리뷰 작성 중 오류가 발생했습니다.");
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);

    // Find the paymentId associated with the selected product
    const selectedProduct = orderGroup[orderId].products.find(
      (product) => product.productId === parseInt(productId)
    );
    if (selectedProduct) {
      setPaymentId(selectedProduct.paymentId);
    }
  };

  if (!isOpen) return null;

  const availableProducts = orderGroup[orderId]?.products.filter(
    (product) => !product.review
  );

  return (
    <div className="review-modal">
      <div className="review-modal-content">
        <div className="review-select-box">
          <label className="review-product-label">
            리뷰 작성이 가능한 상품
          </label>
          {availableProducts && availableProducts.length > 0 ? (
            <select value={selectedProduct} onChange={handleProductChange}>
              <option value="">상품을 선택해주세요</option>
              {availableProducts.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.productName} ({product.option})
                </option>
              ))}
            </select>
          ) : (
            <p>리뷰 작성이 가능한 상품이 없습니다.</p>
          )}
        </div>
        <div className="review-select-box">
          <label className="review-product-label">
            이미지 업로드 (최대 5개)
          </label>
        </div>
        <div className="image-preview-container">
          <img
            src={FileSelectButtonImage}
            alt="Select"
            className="image-preview"
            style={{ cursor: "pointer" }}
            onClick={() => fileInputRef.current.click()} // 이미지를 클릭했을 때 파일 선택 트리거
          />
          <input
            type="file"
            multiple
            ref={fileInputRef} // useRef를 이용해 input 요소에 접근
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          {displayImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`preview-${index}`}
              className="image-preview"
            />
          ))}
        </div>

        <div className="review-select-box">
          <label className="review-product-label">별점</label>

          <div className="rating-input">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => setRating(index + 1)}
                className="rating-star"
              >
                {index < rating ? <FaStar /> : <FaRegStar />}
              </span>
            ))}
          </div>
        </div>
        <div className="review-select-box">
          <label className="review-product-label review-content-area">
            리뷰 내용
          </label>
          <textarea
            value={reviewContent}
            onChange={handleReviewContentChange}
          />
        </div>

        <button onClick={handleReviewSubmit} className="review-write-btn">
          리뷰 작성 완료
        </button>
      </div>
    </div>
  );
}

export { ReviewModal };
