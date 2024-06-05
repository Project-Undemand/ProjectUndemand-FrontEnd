import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineShoppingBag, MdOutlineMenu } from "react-icons/md";
import "./Topbar.css";
import axios from "axios";

function Topbar({
  isMenuVisible,
  setIsMenuVisible,
  processedCategoryData,
  processedMUCategoryData,
  handleConditionSelect,
  isLoggedin,
  setIsLoggedin,
  cartProducts,
  profileData,
  profileImageUrl,
  profileImage,
  memberRole,
  setMemberId,
  setMemberRole,
}) {
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState(null);
  const [isBurgerClicked, setIsBurgerClicked] = useState(false);
  const categoryLinks = [
    {
      to: "/products/BEST",
      label: "BEST",
      contents: processedCategoryData,
    },
    {
      to: "/products/NEW",
      label: "NEW",
      contents: processedCategoryData,
    },
    {
      to: "/products/UNISEX",
      label: "UNISEX",
      contents: processedMUCategoryData,
    },
    {
      to: "/products/MEN",
      label: "MEN",
      contents: processedMUCategoryData,
    },
    {
      to: "/products/WOMEN",
      label: "WOMEN",
      contents: processedCategoryData,
    },
    {
      to: "/products/RECOMMEND",
      label: "RECOMMEND",
      contents: processedCategoryData,
    },
  ];
  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태를 확인하여 상태를 설정합니다.
    const accessToken = localStorage.getItem("Authorization");
    if (accessToken) {
      setIsLoggedin(true);
      setMemberId(localStorage.getItem("memberId"));
      setMemberRole(localStorage.getItem("memberRole"));
    } else {
      setIsLoggedin(false);
      setMemberId("");
      setMemberRole("");
    }
  }, []);

  const handleMouseOver = (index) => {
    setHoveredLinkIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredLinkIndex(null);
  };

  /**
   * 로그아웃 클릭 시 , 브라우저에 저장된 Access, Refresh 를 제거합니다.
   * @returns
   */
  const handleLogoutClick = async () => {
    try {
      // 로그아웃 API 요청
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}/logout`,
        {},
        {
          withCredentials: true, // 쿠키를 포함하여 요청
        }
      );

      // 로컬 스토리지에서 Authorization 값 확인
      const authorization = localStorage.getItem("Authorization");
      setIsLoggedin(false);

      // 로컬 스토리지에서 Authorization 값 제거
      localStorage.removeItem("Authorization");
      localStorage.removeItem("memberId");
      localStorage.removeItem("memberRole");

      console.log("로그아웃 완료.");

      window.location.replace("/login");
    } catch (error) {
      console.error("로그아웃 요청 중 오류가 발생했습니다:", error);
    }
  };

  const handleBurgerBtnClick = () => {
    setIsBurgerClicked((prevState) => !prevState);
    setIsMenuVisible((prevState) => !prevState);
  };

  const handleCategoryOptionSelect = (parentCategory) => {
    localStorage.setItem("selectedCategoryOption", parentCategory.name);
    localStorage.removeItem("selectedSubCategoryOption");
    localStorage.setItem("parentCategoryId", parentCategory.categoryId);
    localStorage.removeItem("childCategoryId");
    localStorage.removeItem("topMenuClicked");
    setIsMenuVisible(false);
  };

  const handleSubcategoryOptionSelect = (childCategory) => {
    localStorage.setItem("selectedSubCategoryOption", childCategory.name);
    localStorage.setItem("childCategoryId", childCategory.categoryId);
    localStorage.removeItem("topMenuClicked");
    setIsMenuVisible(false);
  };

  return (
    <div className="topbar">
      <div className="topbar-logo">
        <Link to="/">
          <img src="/ODD_LOGO_FULL.png" alt="ODD Logo" />
        </Link>
        <div
          className={`topbar-navbar-narrow ${
            isLoggedin === true ? "mobile-loggedin" : ""
          }`}
        >
          {isLoggedin && (
            <Link
              to="/cart"
              onClick={() => {
                setIsBurgerClicked(false);
                setIsMenuVisible(false);
              }}
              className="mobile-loggedin-cart-btn"
            >
              <MdOutlineShoppingBag />
              <p className="cart-count">{cartProducts.length}</p>
            </Link>
          )}
          <MdOutlineMenu
            className="burger-menu-btn"
            onClick={() => handleBurgerBtnClick()}
          />
          <div
            className={`nnavbar-accordion-menu-container ${
              isBurgerClicked === true ? "burger-menu-drop" : ""
            }`}
          >
            <div className="nnavbar-accordion-menu">
              <div className="conditions-container">
                {categoryLinks.map((link, index) => (
                  <div key={index} className="condition-link">
                    <Link
                      to={link.to}
                      onMouseOver={() => handleMouseOver(index)}
                      onClick={() => {
                        handleConditionSelect(link);
                        setIsBurgerClicked(false);
                        setIsMenuVisible(false);
                      }}
                      className={
                        hoveredLinkIndex === index ? "condition-hovered" : ""
                      }
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="user-btn-container">
                {!isLoggedin ? (
                  <ul className="user-btn-box logged-in-false">
                    <li>
                      <Link
                        to="/signup"
                        onClick={() => {
                          setIsBurgerClicked(false);
                          setIsMenuVisible(false);
                        }}
                      >
                        Join
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        onClick={() => {
                          setIsBurgerClicked(false);
                          setIsMenuVisible(false);
                        }}
                      >
                        Log In
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/inquiry"
                        onClick={() => {
                          setIsBurgerClicked(false);
                          setIsMenuVisible(false);
                        }}
                      >
                        Q&A
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="user-btn-box logged-in-true">
                    <li className="hello-user">
                      <Link
                        to="/user/mypage"
                        onClick={() => {
                          setIsBurgerClicked(false);
                          setIsMenuVisible(false);
                        }}
                      >
                        <span>
                          {profileData && profileData.nickname
                            ? `Hello, ${profileData.nickname}!`
                            : `Hello, ODD!`}
                        </span>
                        <img src={profileImageUrl} alt="Profile img" />
                      </Link>
                    </li>
                    {memberRole === "ADMIN" && (
                      <li className="admin-page-btn">
                        <Link
                          to="/admin"
                          onClick={() => {
                            setIsBurgerClicked(false);
                            setIsMenuVisible(false);
                          }}
                        >
                          Admin Page
                        </Link>
                      </li>
                    )}
                    <li className="wishlist-btn">
                      <Link
                        to="/my-wish-list"
                        onClick={() => {
                          setIsBurgerClicked(false);
                          setIsMenuVisible(false);
                        }}
                      >
                        Wish List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/inquiry"
                        onClick={() => {
                          setIsBurgerClicked(false);
                          setIsMenuVisible(false);
                        }}
                      >
                        Q&A
                      </Link>
                    </li>
                    <li className="logout-btn">
                      <Link
                        onClick={() => {
                          handleLogoutClick();
                          setIsBurgerClicked(false);
                        }}
                      >
                        Log out
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="topbar-navbar-normal">
        <div className="topbar-navbar-container">
          <ul
            className="categorybox"
            onMouseLeave={() => {
              setIsMenuVisible(false);
              handleMouseLeave();
            }}
          >
            {categoryLinks.map((link, index) => (
              <li
                key={index}
                onMouseOver={() => setIsMenuVisible(true)}
                className={hoveredLinkIndex === index ? "hovered" : ""}
              >
                <Link
                  to={link.to}
                  onMouseOver={() => handleMouseOver(index)}
                  onClick={() => {
                    handleConditionSelect(link);
                  }}
                >
                  {link.label}
                </Link>
                <div className={`accordion-menu ${isMenuVisible && "active"}`}>
                  {hoveredLinkIndex !== null && (
                    <div className="accordion-menu-container">
                      {categoryLinks[hoveredLinkIndex].contents.map(
                        (content, i) => {
                          return (
                            <ul className="options-box" key={i}>
                              <li className="option-title">
                                <Link
                                  to={`${categoryLinks[hoveredLinkIndex].to}-${content.name}`}
                                  onClick={() => {
                                    handleCategoryOptionSelect(content);
                                  }}
                                >
                                  {content.name}
                                </Link>
                              </li>
                              {content.children.map((children, j) => (
                                <li key={j} className="option">
                                  <Link
                                    to={`${categoryLinks[hoveredLinkIndex].to}-${content.name}-${children.name}`}
                                    onClick={() => {
                                      localStorage.setItem(
                                        "selectedCategoryOption",
                                        content.name
                                      );
                                      localStorage.setItem(
                                        "parentCategoryId",
                                        content.categoryId
                                      );
                                      handleSubcategoryOptionSelect(children);
                                    }}
                                  >
                                    {children.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {!isLoggedin ? (
            <ul className="userbox logged-in-false">
              <li>
                <Link to="/signup">Join</Link>
              </li>
              <li>
                <Link to="/login">Log In</Link>
              </li>
              <li>
                <Link to="/inquiry">Q&A</Link>
              </li>
            </ul>
          ) : (
            <ul className="userbox logged-in-true">
              <li>
                <Link to="/cart">
                  <MdOutlineShoppingBag />
                  <p className="cart-count">{cartProducts.length}</p>
                </Link>
              </li>
              <li className="hello-user">
                <Link to="/user/mypage">
                  <span>
                    {profileData && profileData.nickname
                      ? `Hello, ${profileData.nickname}!`
                      : `Hello, ODD!`}
                  </span>
                  <img src={profileImageUrl} alt="Profile img" />
                </Link>
                <ul className="user-dropdown-menu">
                  {memberRole === "ADMIN" && (
                    <li className="admin-page-btn">
                      <Link to="/admin">Admin Page</Link>
                    </li>
                  )}
                  <li className="mypage-btn">
                    <Link to="/user/mypage">My Page</Link>
                  </li>
                  <li className="wishlist-btn">
                    <Link to="/user/mypage/my-wish-list">Wish List</Link>
                  </li>
                  <li>
                    <Link to="/inquiry">Q&A</Link>
                  </li>
                  <li className="logout-btn">
                    <Link onClick={handleLogoutClick}>Log Out</Link>
                  </li>
                </ul>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
