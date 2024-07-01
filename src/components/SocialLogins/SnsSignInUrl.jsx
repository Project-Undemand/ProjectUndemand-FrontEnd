import React from "react";

const SnsSignInUrl = ({ type, isLoggedin, setIsLoggedin }) => {
  const handleSignIn = () => {
    let AUTH_URL = "";

    switch (type) {
      case "Naver":
        AUTH_URL = `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}/oauth2/authorization/naver`;
        break;
      case "Kakao":
        AUTH_URL = `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}/oauth2/authorization/kakao`;
        break;
      case "Google":
        AUTH_URL = `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}/oauth2/authorization/google`;
        break;
      default:
        AUTH_URL = "";
    }
    console.log("isLoggedin. SnsSignInUrl");

    window.location.href = AUTH_URL;
  };

  return (
    <button onClick={handleSignIn} className={`sns-button ${type}-button`}>
      {type !== "Kakao" && (
        <>
          <div className={`${type}-button-image`}></div>
          <span>Sign in with {type}</span>
        </>
      )}
    </button>
  );
};

export { SnsSignInUrl };
