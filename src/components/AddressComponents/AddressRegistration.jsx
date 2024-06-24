import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddressList.css";
import "./AddressRegistration.css";
import DaumPostcode from "react-daum-postcode";

function AddressRegistration({
  memberId,
  addressData,
  setAddressData,
  setDefaultAddress,
  fetchBasicOnCheckbox,
  setFetchBasicOnCheckbox,
}) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value || "";

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

      return updatedState;
    });

    if (name === "fetchBasicOnCheckbox") {
      setFetchBasicOnCheckbox(newValue);
    }
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    const { saveAddress, ...addressDataToSubmit } = addressData;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/address/${memberId}`,
        addressDataToSubmit,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      console.log("Address created:", response.data);
      onSave();
    } catch (error) {
      console.error("Error creating address:", error);
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
    if (state === "FORCE_CLOSE") {
      setIsOpen(false);
    } else if (state === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };

  const fetchDefaultAddress = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/address/${memberId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      const defaultAddressData = response.data.filter(
        (address) => address.defaultAddress === true
      );
      setDefaultAddress(defaultAddressData);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    if (fetchBasicOnCheckbox) {
      fetchDefaultAddress();
    }
  }, [fetchBasicOnCheckbox]);

  return (
    <div className="my-address-list-page">
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
            value={addressData.addressName || ""}
            onChange={handleChange}
            // required
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
            value={addressData.recipient || ""}
            onChange={handleChange}
            // required
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
                value={addressData.postCode || ""}
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
              value={addressData.address || ""}
              onChange={handleChange}
              readOnly
              placeholder="기본주소"
              className="address-input"
            />
            <input
              type="text"
              name="detailAddress"
              value={addressData.detailAddress || ""}
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
              value={addressData.phoneNumberPrefix || "010"}
              onChange={handleChange}
            >
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
              value={addressData.phoneNumberPart1 || ""}
              maxLength="4"
              onChange={handleChange}
              className="phone-number-input input-height-default"
            />
            -
            <input
              type="text"
              name="phoneNumberPart2"
              value={addressData.phoneNumberPart2 || ""}
              maxLength="4"
              onChange={handleChange}
              className="phone-number-input input-height-default"
            />
          </div>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="saveAddress"
            name="saveAddress"
            checked={addressData.saveAddress || false}
            onChange={handleChange}
          />
          <label htmlFor="saveAddress">입력한 배송지 저장</label>
          <input
            type="checkbox"
            id="fetchBasicOnCheckbox"
            name="fetchBasicOnCheckbox"
            checked={fetchBasicOnCheckbox}
            onChange={handleChange}
          />
          <label htmlFor="fetchBasicOnCheckbox">기본 배송지 불러오기</label>
        </div>
      </form>
    </div>
  );
}

export default AddressRegistration;
