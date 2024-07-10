import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// CSS
import "./MyWishListPage.css";
import WishBtn from "../../components/WishBtn/WishBtn.jsx";
import { MyProfilePage } from "../MyProfilePage/MyProfilePage.jsx";

function MyWishListPage({
  isLoggedin,
  memberId,
  profileData,
  profileImageUrl,
}) {
  const wishLists = useSelector((state) => state.wishList);

  return (
    <div className="my-wish-list-page">
      <MyProfilePage
        isLoggedin={isLoggedin}
        memberId={memberId}
        profileData={profileData}
        profileImageUrl={profileImageUrl}
      />
      <div className="my-wish-list-page-title">
        <span>찜한 상품</span>
        <div className="total-payhis-count">
          ({`${Object.keys(wishLists).length}개`})
        </div>
      </div>
      <div className="my-wish-list-container">
        {wishLists && wishLists.length > 0 ? (
          wishLists.map((wishItem) => (
            <div key={wishItem.wishListId} className="my-wish-product-card">
              <Link to={`/product/${wishItem.productId}`}>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${wishItem.productThumbnails[0]}`}
                  alt={wishItem.productName}
                  className="wish-product-image"
                />
              </Link>
              <div className="my-wish-product-info">
                <div className="pd-name-type">
                  <WishBtn
                    memberId={memberId}
                    productId={wishItem.productId}
                    isLoggedin={isLoggedin}
                    pageType={"profileWishList"}
                  />
                  <span>
                    {wishItem.productName}, {wishItem.productType}
                  </span>
                </div>
                <div className="pd-price">
                  <span>{`${wishItem.price} 원`}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            마음에 드는 상품에 찜하기를 해보세요. 나의 찜목록에서 모아보실 수
            있답니다.
          </div>
        )}
      </div>
    </div>
  );
}

export { MyWishListPage };
