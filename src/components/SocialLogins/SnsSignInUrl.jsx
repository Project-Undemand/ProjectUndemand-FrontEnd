import React from "react";

const SnsSignInUrl = ({ type }) => {
  // 클릭 이벤트 핸들러
  const handleSignIn = () => {
    console.log("============ handleKakaoSignIn 시작 ============");
    const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const KAKAO_REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL;

    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;
  };

  // 각 SNS에 대한 로그인 링크 생성 함수

  return (
    <button onClick={handleSignIn} className="sns-button kakao-button"></button>
  );
};

export { SnsSignInUrl };
