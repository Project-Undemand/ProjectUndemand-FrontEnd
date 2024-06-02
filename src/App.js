import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, fetchProfileImage } from "./profileSlice";
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
import { AdministratorPage } from "./pages/AdministratorPage/AdministratorPage.jsx";
import { MyPage } from "./pages/MyPage/MyPage.jsx";
import { MyReviewPage } from "./pages/MyReviewPage/MyReviewPage.jsx";
import PrivateRoutes from "../src/components/Routes/PrivateRoutes.jsx";
import AdminRoutes from "./components/Routes/AdminRoutes.jsx";
import Footer from "./components/Footer/Footer.jsx";
import TokenRefreshComponent from "./components/TokenRefresh/TokenRefresh.jsx";
import "./App.css";
import axios from "axios";
import "react-image-crop/dist/ReactCrop.css";

function App() {
  const [categoryData, setCategoryData] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [memberRole, setMemberRole] = useState("");
  const [memberId, setMemberId] = useState("");

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

  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);
  // 리덕스 상태에서 프로필 이미지 가져오기
  const profileImage = useSelector((state) => state.profile.profileImage);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // Blob 데이터를 URL로 변환하여 상태를 업데이트하는 useEffect
  useEffect(() => {
    if (profileImage) {
      //   const imageUrl = URL.createObjectURL(profileImage);
      console.log(profileImage);
      setProfileImageUrl(
        `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${profileImage.replace(
          "src/main/resources/static/",
          ""
        )}`
      );
    } else {
      setProfileImageUrl(
        "https://defaultst.imweb.me/common/img/default_profile.png"
      );
    }
  }, [profileImage]);

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

  // 로그인 했을 때, 프로필 데이터와 이미지 다시 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (memberId) {
        // 프로필 데이터와 이미지 다시 가져오기
        await Promise.all([
          dispatch(fetchProfile(memberId)),
          dispatch(fetchProfileImage(memberId)),
        ]);
      }
    };

    fetchData();
  }, [memberId, dispatch]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/cart/${memberId}`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        setCartProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (memberId) {
      fetchCartData();
    }
  }, [memberId]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/categorys`
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
      setMemberRole(localStorage.getItem("memberRole"));
      //   setProfileImage(localStorage.getItem("ProfileImage"));
    } else {
      setIsLoggedin(false);
      setMemberId("");
      setMemberRole("");
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
      <TokenRefreshComponent />
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
            cartProducts={cartProducts}
            profileData={profileData}
            profileImage={profileImage}
            profileImageUrl={profileImageUrl}
            memberRole={memberRole}
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
            element={
              <MyPage
                isLoggedin={isLoggedin}
                memberId={memberId}
                profileData={profileData}
                profileImageUrl={profileImageUrl}
                setProfileImageUrl={setProfileImageUrl}
              />
            }
          />
          <Route path="/user/mypage/review" element={<MyReviewPage />} />
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
                profileImageUrl={profileImageUrl}
                cartProducts={cartProducts}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductDetailPage
                isLoggedin={isLoggedin}
                memberId={memberId}
                setCartProducts={setCartProducts}
              />
            }
          />
          <Route element={<PrivateRoutes isLoggedin={isLoggedin} />}>
            <Route
              path="/cart"
              element={
                <CartPage
                  memberId={memberId}
                  isLoggedin={isLoggedin}
                  cartProducts={cartProducts}
                  setCartProducts={setCartProducts}
                />
              }
            />
            <Route path="/cart/order" element={<PaymentPage />} />
            <Route path="/cart/order/done" element={<ReceiptPage />} />
            <Route element={<AdminRoutes memberRole={memberRole} />}>
              <Route path="/admin/*" element={<AdministratorPage />} />
            </Route>
          </Route>
        </Routes>
      </div>

      <div className="Bottom-section">
        <Footer />
      </div>
    </div>
  );
}

export default App;
