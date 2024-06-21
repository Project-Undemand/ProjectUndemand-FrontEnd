import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ACCESS_TOKEN_EXPIRATION_PERIOD = 10 * 60 * 1000; // 10분 (단위: 밀리초)

// Access token을 주기적으로 갱신하는 컴포넌트
export const PeriodicAccessTokenRefresher = () => {
  const requestCount = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const accessTokenGenerator = async () => {
      try {
        requestCount.current += 1;
        console.log(`Access token request count: ${requestCount.current}`);

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/reissue/access`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const newAccessToken = response.data["accessToken"];
        extractUserInfoFromAccess(newAccessToken);
      } catch (error) {
        console.error(
          "refresh token이 만료되었거나 존재하지 않습니다. ",
          error
        );

        navigate("/login");
      }
    };

    const interval = setInterval(
      accessTokenGenerator,
      ACCESS_TOKEN_EXPIRATION_PERIOD
    );

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

/**
 *  소셜 로그인 후 access token 재발급 함수
 * */
export const socialLoginAccessToken = async (navigate) => {
  try {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("memberId");

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/reissue/access`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const newAccessToken = response.data["accessToken"];
    localStorage.setItem("Authorization", "Bearer " + newAccessToken);

    const payloadObject = decodeJWT(newAccessToken);

    if (payloadObject) {
      localStorage.setItem("memberId", payloadObject.memberId);
      localStorage.setItem("memberRole", payloadObject.role);
    }
  } catch (error) {
    console.error(
      "refresh token 이 만료되었기 때문에, access token 재발급에 실패했습니다. ",
      error
    );

    navigate("/login");
  }
};

export const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Function to check token expiration
export const isAccessTokenValid = (accessToken) => {
  try {
    const decodedToken = decodeJWT(accessToken);

    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시각 (초 단위)
      const tokenExpirationTime = decodedToken.exp; // 토큰 만료 시간 (초 단위)

      return tokenExpirationTime > currentTime;
    } else {
      console.error("Token does not have exp field");
      return false;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const extractUserInfoFromAccessAndRefresh = (
  AccessToken,
  RefreshToken
) => {
  console.log("extract UserInfo From Access And Refresh 호출됨");

  if (AccessToken) {
    // 기존에 저장된 Authorization 토큰과 memberId를 삭제합니다.
    localStorage.removeItem("Authorization");
    localStorage.removeItem("memberId");
    localStorage.removeItem("memberRole");

    // accessToken 디코딩
    const decodedToken = decodeJWT(AccessToken);

    // decodedToken이 존재한다면 실행
    if (decodedToken?.memberId && decodedToken?.role) {
      const memberId = decodedToken.memberId;
      const memberRole = decodedToken.role;

      // 로컬 스토리지에 새로운 값 저장
      localStorage.setItem("memberId", memberId);
      localStorage.setItem("memberRole", memberRole);
      localStorage.setItem("Authorization", "Bearer " + AccessToken);

      // 쿠키에 refreshToken 저장
      const refreshAuthorization = "Bearer+" + RefreshToken;
      document.cookie = `refreshAuthorization=${refreshAuthorization}; path=/; SameSite=Lax`;
    } else {
      console.error("decodedToken에 id 또는 role이 없음");
    }
  } else {
    console.error("AccessToken이 존재하지 않아, extractUserInfo 실패.");
  }
};

export const extractUserInfoFromAccess = (AccessToken) => {
  console.log("extract User Info From Access 호출됨");

  if (AccessToken) {
    // 기존에 저장된 Authorization 토큰과 memberId를 삭제합니다.
    localStorage.removeItem("Authorization");
    localStorage.removeItem("memberId");
    localStorage.removeItem("memberRole");

    // accessToken 디코딩
    const decodedToken = decodeJWT(AccessToken);

    // decodedToken이 존재한다면 실행
    if (decodedToken?.memberId && decodedToken?.role) {
      const memberId = decodedToken.memberId;
      const memberRole = decodedToken.role;

      // 로컬 스토리지에 새로운 값 저장
      localStorage.setItem("memberId", memberId);
      localStorage.setItem("memberRole", memberRole);
      localStorage.setItem("Authorization", "Bearer " + AccessToken);
    } else {
      console.error("decodedToken에 memberId 또는 role이 없음");
    }
  } else {
    console.error("AccessToken이 존재하지 않아, extractUserInfo 실패.");
  }
};
