import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import swal from "sweetalert";

const Signup = ({ isLoggedin, memberId }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [nicknameValid, setNicknameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordCheckValid, setPasswordCheckValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  // 로그인 시 회원가입 페이지 접근 제한
  useEffect(() => {
    if (isLoggedin) {
      swal({
        title:
          "이미 로그인을 한 상태에서, 회원가입 페이지 접근은 불가합니다. You cannot access the registration page while logged in.",
      });
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  useEffect(() => {
    const isAllValid =
      emailValid && passwordValid && passwordCheckValid && nicknameValid;
    setNotAllow(!isAllValid);
    console.log("emailValid : " + emailValid);
    console.log("passwordValid : " + passwordValid);
    console.log("passwordCheckValid : " + passwordCheckValid);
    console.log("nicknameValid : " + nicknameValid);
  }, [emailValid, passwordValid, passwordCheckValid, nicknameValid]);

  const handleEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (emailRegex.test(newEmail)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };
  const handleNickname = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    const isNicknameValid = newNickname.trim().length > 0;
    // 닉네임이 유효하지 않거나 비어있을 때 회원가입 버튼 비활성화
    setNicknameValid(isNicknameValid);
    setNotAllow(!isNicknameValid || newNickname.trim().length === 0);
  };

  const handlePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const passwordRegex =
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    setPasswordValid(passwordRegex.test(newPassword));
  };

  const handlePasswordCheck = (e) => {
    const newPasswordCheck = e.target.value;
    setPasswordCheck(newPasswordCheck);
    const isPasswordMatch = newPasswordCheck === password;
    setPasswordCheckValid(isPasswordMatch);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const signupData = {
      email,
      nickname,
      password,
      //   isActive: false,
      // 활성화 여부를 false로 초기화
    };

    // 서버에 회원가입 요청을 보내고 응답을 받아옴
    try {
      const response = await axios.post(
        "http://localhost:8080/join",
        signupData,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );

      if (parseInt(response.status) === 201) {
        // Redirect to login.html
        // console.log("성공! 회원 id: " + data.id);
        navigate("/login"); // 로그인 성공시 홈으로 이동합니다.
        setTimeout(() => {
          swal({
            title:
              "회원가입을 환영합니다. 가입하신 이메일로 인증 후, 로그인 해주세요.",
          });
        }, 100);
      }
      // response.status 가 201 이 아닌 상황에서의 예외처리도 생각 해야합니다.
    } catch (error) {
      console.error("회원 가입 실패 : ", error.response.data);
      // 클라이언트에게 경고 메세지를 띄워주는 자바스크립트 코드
      var message = " 은 이미 가입된 이메일입니다. \n 로그인 해주세요. ";
      swal({
        title: email + message,
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box-background">
        <div className="signup-box">
          <div className="signup-box-top">
            <div className="title">회원가입</div>
          </div>
          <div className="signup-box-middle">
            <div className="inputWrap">
              <label htmlFor="email" className="inputTitle">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className="input"
                onChange={handleEmail}
              />
            </div>
            <div className="errorMessageWrap">
              {!emailValid && email.length > 0 && (
                <div>
                  이메일로 회원가입 인증링크가 제공됩니다. 실제 사용하시는
                  이메일을 입력해주세요.
                </div>
              )}
            </div>
            <div className="please-box"></div>
            <div className="inputWrap">
              <label htmlFor="nickname" className="inputTitle">
                닉네임
              </label>
              <input
                type="text"
                className="input"
                id="nickname"
                value={nickname}
                onChange={handleNickname}
              />
            </div>
            <div className="errorMessageWrap">
              {!nicknameValid && nickname.length === 0 && (
                <div>닉네임을 입력해주세요.</div>
              )}
            </div>

            <div className="inputWrap">
              <label htmlFor="password" className="inputTitle">
                비밀번호
              </label>
              <input
                type="password"
                className="input"
                id="password"
                value={password}
                onChange={handlePassword}
              />
            </div>

            <div className="inputWrap">
              <label htmlFor="password_certify" className="inputTitle">
                비밀번호 확인
              </label>
              <input
                type="password"
                className="input"
                id="password_certify"
                value={passwordCheck}
                onChange={handlePasswordCheck}
              />
            </div>
            <div className="errorMessageWrap">
              {!passwordCheckValid && passwordCheck.length > 0 && (
                <div>비밀번호가 일치하지 않습니다.</div>
              )}
            </div>
            <div className="errorMessageWrap">
              {!passwordValid && (
                <div>
                  <div>
                    비밀번호는 최소 8자에서 최대 20자 사이의 문자열이어야
                    합니다.
                  </div>
                  <div>
                    적어도 하나의 알파벳, 숫자, 특수 문자가 포함되어야 합니다.
                  </div>
                  <div>
                    문자열에는 알파벳, 숫자, 특수 문자 이외의 다른 문자가
                    포함되어서는 안 됩니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="signup-box-bottom">
        <button
          onClick={handleSignup}
          disabled={notAllow}
          className="signinButton"
        >
          회원가입
        </button>
        <p className="login-link">
          이미 회원이신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export { Signup };
