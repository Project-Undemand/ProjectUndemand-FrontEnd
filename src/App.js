/* eslint-disable */
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar/Topbar.jsx";
import ChannelTalk from "./ChannelTalk.js";
import { Main } from "./pages/Main/Main.jsx";
import { Signup } from "./pages/AuthPages/Signup.jsx";
import { Login } from "./pages/AuthPages/Login.jsx";
import { KakaoLoginHandeler } from "./components/SocialLogins/KakaoLoginHandeler.jsx";
import { CategoryPage } from "./pages/Category/CategoryPage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage/ProductDetailPage.jsx";
import { InquiryPage } from "./pages/InquiryPage/InquiryPage.jsx";
import { InquiryDetailPage } from "./pages/InquiryDetailPage/InquiryDetailPage.jsx";
import { CartPage } from "./pages/CartPage/CartPage.jsx";
import { PaymentPage } from "./pages/PaymentPage/PaymentPage.jsx";
import { ReceiptPage } from "./pages/ReceiptPage/ReceiptPage.jsx";
// import { MyReviewPage } from "./pages/MyReviewPage/MyReviewPage.jsx";
import { AdministratorPage } from "./pages/AdministratorPage/AdministratorPage.jsx";
import { MyPage } from "./pages/MyPage/MyPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./App.css";
import axios from "axios";

function App() {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [profileData, setProfileData] = useState(null);

  const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);
  const [selectedSubCategoryOption, setSelectedSubCategoryOption] =
    useState(null);
  const [categoryId, setCategoryId] = useState("");

  const [isScroll, setIscroll] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isReceiptPage, setIsReceiptPage] = useState(false);
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  const channelTalkPlugInKey = process.env.REACT_APP_CHANNELTALK_PLUGIN_KEY;

  const channelTalkLoad = () => {
    ChannelTalk.loadScript();
    const channelTalkConfig = {
      pluginKey: channelTalkPlugInKey,
    };
    if (isLoggedin) {
      channelTalkConfig.memberId = memberId;
    }
    ChannelTalk.boot(channelTalkConfig);
    ChannelTalk.setAppearance("system");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 로컬 스토리지에서 Authorization 토큰 가져오기
        const authorization = localStorage.getItem("Authorization");
        // Authorization 헤더를 포함한 axios 요청
        const response = await axios.get(
          `http://localhost:8080/api/v1/profile/${memberId}`,
          {
            headers: {
              Authorization: authorization, // 토큰을 Authorization 헤더에 추가
            },
          }
        );
        setProfileData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, [memberId]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/categorys"
        );
        setCategoryData(response.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();

    const accessToken = localStorage.getItem("Authorization");
    if (accessToken) {
      setIsLoggedin(true);
      setMemberId(localStorage.getItem("memberId"));
    } else {
      setIsLoggedin(false);
      setMemberId("");
    }

    channelTalkLoad();
  }, []);

  const processedCategoryData = categoryData.map((parentCategory) => {
    const processedParentName = parentCategory.name
      .replace(/[-&]/g, "")
      .toUpperCase();
    const processedChildren = parentCategory.children.map((childCategory) => {
      const processedChildName = childCategory.name
        .replace(/[-&]/g, "")
        .toUpperCase();

      return {
        name: processedChildName,
        categoryId: childCategory.categoryId,
        depth: childCategory.depth,
      };
    });

    return {
      name: processedParentName,
      categoryId: parentCategory.categoryId,
      depth: parentCategory.depth,
      children: processedChildren,
    };
  });

  const genderOptions = processedCategoryData.filter(
    (category) => category.name !== "DRESSSET"
  );

  const processedMUCategoryData = genderOptions.map((categoryOptions) => {
    if (categoryOptions.name === "BOTTOM") {
      const updatedSubOptions = categoryOptions.children.filter(
        (subOption) => subOption.name !== "SKIRT"
      );
      return {
        ...categoryOptions,
        children: updatedSubOptions,
      };
    } else {
      return categoryOptions;
    }
  });

  const handleConditionSelect = (condition) => {
    localStorage.setItem("condition", condition.label);
    localStorage.setItem("topMenuClicked", true);
    localStorage.removeItem("selectedCategoryOption");
    localStorage.removeItem("selectedSubCategoryOption");
    localStorage.removeItem("parentCategoryId");
    localStorage.removeItem("childCategoryId");
    setCategoryId("");
    setIsMenuVisible(false);
  };

  const handlePCategorySelect = (parentCategory) => {
    localStorage.setItem("selectedCategoryOption", parentCategory.name);
    localStorage.removeItem("selectedSubCategoryOption");
    localStorage.setItem("parentCategoryId", parentCategory.categoryId);
    localStorage.removeItem("childCategoryId");
    localStorage.removeItem("topMenuClicked");
    setIsMenuVisible(false);
    if (
      selectedCategoryOption === parentCategory.name &&
      !selectedSubCategoryOption
    ) {
      localStorage.removeItem("selectedCategoryOption");
      localStorage.removeItem("parentCategoryId");
      setCategoryId("");
      return;
    }
  };

  const handleCCategorySelect = (childCategory) => {
    localStorage.setItem("selectedSubCategoryOption", childCategory.name);
    localStorage.setItem("childCategoryId", childCategory.categoryId);
    localStorage.removeItem("topMenuClicked");
    setIsMenuVisible(false);
    if (selectedSubCategoryOption === childCategory.name) {
      localStorage.removeItem("selectedSubCategoryOption");
      localStorage.removeItem("childCategoryId");
      return;
    }
  };

  useEffect(() => {
    if (location.pathname === "/cart/order/done") {
      setIsReceiptPage(true);
    } else {
      setIsReceiptPage(false);
    }
  }, [location.pathname === "/cart/order/done"]);

  useEffect(() => {
    if (location.pathname.startsWith("/products/")) {
      setIsCategoryPage(true);
    } else {
      setIsCategoryPage(false);
    }
  }, [location.pathname.startsWith("/products/")]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120 && window.innerWidth > 1200) {
        setIscroll(true);
      } else {
        setIscroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div className="Body">
      {isReceiptPage === false && isCategoryPage === false ? (
        <div className={`Top-section ${isScroll ? "scroll" : ""}`}>
          <Topbar
            isMenuVisible={isMenuVisible}
            setIsMenuVisible={setIsMenuVisible}
            processedCategoryData={processedCategoryData}
            processedMUCategoryData={processedMUCategoryData}
            handleConditionSelect={handleConditionSelect}
            handleCategoryOptionSelect={handlePCategorySelect}
            handleSubcategoryOptionSelect={handleCCategorySelect}
            isLoggedin={isLoggedin}
            // 2024.05.04 회원 프로필 데이터를 위해 memberId 추가
            profileData={profileData}
          />
        </div>
      ) : (
        <div></div>
      )}
      <div
        className={`Middle-section ${
          isScroll && !isReceiptPage && !isCategoryPage ? "scroll" : ""
        } ${isMenuVisible ? "blur" : ""}`}
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/login/oauth2/code/kakao" //kakao_redirect_url
            element={<KakaoLoginHandeler />}
          />
          <Route
            path="/user/mypage/*"
            element={<MyPage isLoggedin={isLoggedin} memberId={memberId} />}
          />
          {/* <Route path="/user/mypage/review" element={<MyReviewPage />} /> */}
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/inquiry/:inquiryId" element={<InquiryDetailPage />} />
          <Route
            path="/products/:condition"
            element={
              <CategoryPage
                isLoggedin={isLoggedin}
                filterOptions={processedCategoryData}
                menUnisexFilterOptions={processedMUCategoryData}
                selectedCategoryOption={selectedCategoryOption}
                setSelectedCategoryOption={setSelectedCategoryOption}
                selectedSubCategoryOption={selectedSubCategoryOption}
                setSelectedSubCategoryOption={setSelectedSubCategoryOption}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                handleCategoryOptionSelect={handlePCategorySelect}
                handleSubcategoryOptionSelect={handleCCategorySelect}
                profileData={profileData}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductDetailPage isLoggedin={isLoggedin} memberId={memberId} />
            }
          />
          <Route
            path="/cart"
            element={<CartPage memberId={memberId} isLoggedin={isLoggedin} />}
          />
          <Route path="/cart/order" element={<PaymentPage />} />
          <Route path="/cart/order/done" element={<ReceiptPage />} />
          <Route path="/admin/*" element={<AdministratorPage />} />
        </Routes>
      </div>

      <div className="Bottom-section">
        <Footer />
      </div>
    </div>
  );
}

export default App;
