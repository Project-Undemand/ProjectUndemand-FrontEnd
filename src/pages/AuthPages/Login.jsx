import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
// 외부
import axios from "axios";
import swal from "sweetalert";
// 컴포넌트 & CSS
import { SnsLogins } from "../../components/SocialLogins/SnsLogins.jsx";
import { extractUserInfoFromAccess } from "../../components/Token/TokenUtil.jsx";
import { fetchProfile, fetchProfileImage } from "../../profileSlice.js"; // Import the necessary actions
import "./Signup.css";
// import { type } from "@testing-library/user-event/dist/type/index.js";

const Login = ({ isLoggedin, setIsLoggedin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };
  const handlePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const ERROR_MESSAGES = {
    SERVER_ERROR: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    LOGIN_FAILED: "로그인에 실패했습니다. 다시 시도해주세요.",
    NETWORK_ERROR: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
    INVALID_CREDENTIALS: "비밀번호가 틀렸습니다.",
    EMAIL_NOT_FOUND: "존재하지 않는 이메일입니다.",
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}/login`,
        loginData,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );

      const newAccessToken = response.data.accessToken;

      if (parseInt(response.status) === 200) {
        extractUserInfoFromAccess(newAccessToken);
        setIsLoggedin(true);

        const memberId = localStorage.getItem("memberId");

        await Promise.all([
          dispatch(fetchProfile(memberId)),
          dispatch(fetchProfileImage(memberId)),
        ]);

        setTimeout(() => {
          navigate("/");
        }, 200);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.error || "로그인에 실패했습니다.";
        swal({ title: errorMessage });
        console.error("로그인 실패: ", error.response);
      } else {
        swal({
          title: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
        });
        console.error("로그인 실패: ", error);
      }
    }
  };

  return (
    <div className="signin-container">
      <div className="login-input-container">
        <div className="signup-box-top">
          <div className="title">Login</div>
        </div>
        <div className="login-box">
          <div className="inputWrap">
            <label htmlFor="email" className="inputTitle">
              email
            </label>
            <input
              type="email"
              className="input"
              id="email"
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className="inputWrap">
            <label htmlFor="password" className="inputTitle">
              password
            </label>
            <input
              type="password"
              className="input"
              id="password"
              value={password}
              onChange={handlePassword}
            />
          </div>
          <div className="link-container">
            <Link to="/signup" className="login-link-font">{`회원가입`}</Link>
            <Link
              to="/user/mypage/update-info"
              className="login-link-font"
            >{`비밀번호 재설정`}</Link>
          </div>
        </div>
      </div>

      <div className="signin-button-container">
        <div className="signin-button-box">
          <button onClick={handleLogin} className="signinButton">
            Login
          </button>
          <SnsLogins isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
        </div>
      </div>
    </div>
  );
};

export { Login };
