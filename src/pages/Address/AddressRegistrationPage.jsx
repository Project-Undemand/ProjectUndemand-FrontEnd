import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
// CSS
import "./AddressListPage.css";
import "./AddressRegistrationPage.css";
import { fetchAddressLists } from "../MyPage/MyPageApiUtils";
// reeact-daum-postcode
import DaumPostcode from "react-daum-postcode";

function AddressRegistrationPage({ isLoggedin, memberId }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDefaultAddressRef = useRef(false); // useRef로 기본 주소 체크박스 상태 관리
  const [defaultAddressState, setDefaultAddressState] = useState(false); // useState로 체크박스 상태 관리
  const [addressData, setAddressData] = useState({
    addressId: "",
    addressName: "",
    recipient: "",
    postCode: "",
    address: "",
    detailAddress: "",
    isDefaultAddress: false,
    phoneNumberPrefix: "",
    phoneNumberPart1: "",
    phoneNumberPart2: "",
    recipientPhone: "",
  });

  const themeObj = {
    bgColor: "#FFFFFF",
    pageBgColor: "#FFFFFF",
    postcodeTextColor: "#C05850",
    emphTextColor: "#222222",
  };

  const postCodeStyle = {
    width: "360px",
    height: "480px",
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setAddressData((prevState) => {
      const updatedState = { ...prevState, [name]: newValue };

      if (
        name === "phoneNumberPrefix" ||
        name === "phoneNumberPart1" ||
        name === "phoneNumberPart2"
      ) {
        updatedState.recipientPhone = `${
          updatedState.phoneNumberPrefix || "010"
        }-${updatedState.phoneNumberPart1 || ""}-${
          updatedState.phoneNumberPart2 || ""
        }`;
      }

      console.log(`${name} updated to ${newValue}`);
      return updatedState;
    });
    if (name === "isDefaultAddress") {
      isDefaultAddressRef.current = checked;
    }
  };

  const validateFields = () => {
    const { addressName, recipient, postCode, address, detailAddress } =
      addressData;

    if (!addressName || !recipient || !postCode || !address || !detailAddress) {
      return false;
    }
    return true;
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      swal(
        "필수 필드를 모두 입력해주세요",
        "주소명, 성명, 우편번호, 주소, 상세주소는 필수 입력 항목입니다.",
        "error"
      );
      return;
    }

    try {
      const updatedAddressData = {
        ...addressData,
        isDefaultAddress: isDefaultAddressRef.current,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/address/${memberId}`,
        updatedAddressData,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      console.log("Address created:", response.data);
      fetchAddressLists(dispatch, memberId); // 주소 목록 다시 불러오기
      navigate("/user/mypage/address");
    } catch (error) {
      console.error("Error creating address:", error);

      swal({
        icon: "error",
        title: "주소 생성 실패",
        text: "주소 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  const toggleHandler = () => {
    setIsOpen((prevOpenState) => !prevOpenState);
  };

  const completeHandler = (data) => {
    console.log(data);
    setAddressData((prevState) => ({
      ...prevState,
      address: `${data.roadAddress}`,
      postCode: `${data.zonecode}`,
    }));
    setIsOpen(false);
  };

  const closeHandler = (state) => {
    if (state === "FORCE_CLOSE" || state === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };

  const handleCheckboxChange = () => {
    setDefaultAddressState((prevState) => !prevState);
    isDefaultAddressRef.current = !defaultAddressState;
    console.log(isDefaultAddressRef);
  };

  return (
    <div className="my-address-list-page">
      <div className="my-address-list-page-top">
        <div className="my-address-list-page-title">
          <h2>Address</h2>
        </div>
        <p>자주 쓰는 배송지를 등록 관리하실 수 있습니다.</p>
      </div>

      <form
        onSubmit={handleNewAddressSubmit}
        className="address-registration-form"
      >
        <div className="form-group top-border input-height-default">
          <label>
            배송지명 <span className="required">*</span>
          </label>
          <input
            type="text"
            name="addressName"
            value={addressData.addressName}
            onChange={handleChange}
            required
            className="addressName-input"
          />
        </div>
        <div className="form-group input-height-default">
          <label>
            성명 <span className="required">*</span>
          </label>
          <input
            type="text"
            name="recipient"
            value={addressData.recipient}
            onChange={handleChange}
            required
            className="recipient-input"
          />
        </div>
        <div className="form-group address-form">
          <label style={{ padding: "20px" }}>
            주소 <span className="required">*</span>
          </label>
          <div className="address-input-container">
            <div className="zipcode-input-box input-height-default">
              <input
                type="text"
                name="zipCode"
                value={addressData.postCode}
                onChange={handleChange}
                readOnly
                placeholder="우편번호"
                className="zipcode-input"
              />
              <button type="button" onClick={toggleHandler}>
                주소 찾기
              </button>
            </div>

            {isOpen && (
              <div className="postcode-modal-overlay">
                <div className="postcode-modal-content">
                  <div className="postcode-modal-body">
                    <div className="close-button">
                      <button onClick={() => setIsOpen(false)}>
                        <img
                          src="https://w7.pngwing.com/pngs/336/356/png-transparent-close-remove-delete-x-cross-reject-basic-user-interface-icon.png"
                          alt="Close"
                          s
                        />
                      </button>
                    </div>

                    <DaumPostcode
                      theme={themeObj}
                      style={postCodeStyle}
                      onComplete={completeHandler}
                      onClose={closeHandler}
                    />
                  </div>
                </div>
              </div>
            )}
            <input
              type="text"
              name="address"
              value={addressData.address}
              onChange={handleChange}
              readOnly
              placeholder="기본주소"
              className="address-input"
            />
            <input
              type="text"
              name="detailAddress"
              value={addressData.detailAddress}
              onChange={handleChange}
              placeholder="나머지주소"
              className="address-detail-input input-height-default"
            />
          </div>
        </div>
        <div className="form-group input-height-default">
          <label>
            휴대전화 <span className="required">*</span>
          </label>
          <div className="phone-input">
            <select
              name="phoneNumberPrefix"
              value={addressData.phoneNumberPrefix}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
            </select>
            -
            <input
              type="text"
              name="phoneNumberPart1"
              value={addressData.phoneNumberPart1}
              maxLength="4"
              onChange={handleChange}
              className="phone-number-input input-height-default"
            />
            -
            <input
              type="text"
              name="phoneNumberPart2"
              value={addressData.phoneNumberPart2}
              maxLength="4"
              onChange={handleChange}
              className="phone-number-input input-height-default"
            />
          </div>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isDefaultAddress"
            name="isDefaultAddress"
            checked={defaultAddressState} // useState로 상태 관리
            onChange={handleCheckboxChange} // 상태 변경
          />
          <label htmlFor="isDefaultAddress">기본 배송지로 저장</label>
        </div>
        <div className="form-actions">
          <button type="submit" onClick={handleNewAddressSubmit}>
            배송지 등록
          </button>
          <Link to="/user/mypage/address">취소</Link>
        </div>
      </form>
      <div className="ec-base-help">
        <h3>배송주소록 유의사항</h3>
        <div className="inner">
          <ol>
            <li className="item1">
              배송 주소록은 최대 10개까지 등록할 수 있으며, 별도로 등록하지 않을
              경우 최근 배송 주소록 기준으로 자동 업데이트 됩니다.
            </li>
            <li className="item2"></li>
            <li className="item3">
              기본 배송지는 1개만 저장됩니다. 다른 배송지를 기본 배송지로
              설정하시면 기본 배송지가 변경됩니다.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export { AddressRegistrationPage };
