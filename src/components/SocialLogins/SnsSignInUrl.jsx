import React from "react";

const SnsSignInUrl = ({ type }) => {
  const handleSignIn = () => {
    let AUTH_URL = "";

    switch (type) {
      case "naver":
        AUTH_URL = "http://localhost:8080/oauth2/authorization/naver";
        break;
      case "kakao":
        AUTH_URL = "http://localhost:8080/oauth2/authorization/kakao";
        break;
      case "google":
        AUTH_URL = "http://localhost:8080/oauth2/authorization/google";
        break;
      default:
        AUTH_URL = "";
    }

    window.location.href = AUTH_URL;
  };

  return (
    <button onClick={handleSignIn} className={`sns-button ${type}-button`}>
      Login with {type}
    </button>
  );
};

export { SnsSignInUrl };

//     console.log("============ handleKakaoSignIn 시작 ============");
//     const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
//     const KAKAO_REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL;

//     window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;
