import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
// Component
import PencilIcon from "../../components/ReactImageCropper/PencilIcon.jsx";
import Modal from "../../components/ReactImageCropper/Modal.jsx";
import {
  UserDataFormat,
  UserAgeSelect,
  UserGenderSelect,
} from "./UpdateUserInfoInputBox.jsx";
import { fetchProfile } from "../../profileSlice";

// Css
import "./UpdateUserInfoPage.css";
import "../../components/ReactImageCropper/ImageCropperModal.css";

const UpdateUserInfoPage = ({
  isLoggedin,
  memberId,
  profileData,
  profileImageUrl,
  setProfileImageUrl,
}) => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState({
    intro: false,
    username: false,
    nickname: false,
    gender: false,
    age: false,
  });

  const refs = {
    intro: useRef(null),
    username: useRef(null),
    nickname: useRef(null),
    role: useRef(null),
    gender: useRef(null),
    age: useRef(null),
  };

  const fields = [
    { name: "username", label: "이름", editable: true },
    { name: "nickname", label: "닉네임", editable: true },
  ];

  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState(false);

  const updateAvatar = (imgSrc) => {
    avatarUrl.current = imgSrc;
  };

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleConfirm = async (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    try {
      const newValue = refs[field].current.value;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/profile/${memberId}/${field}`;
      const headers = {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      };

      await axios.put(url, newValue, { headers, withCredentials: true });
      dispatch(fetchProfile(memberId));
      console.log(`${field} update success`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleConfirmSelect = async (field) => {
    try {
      const newValue = refs[field].current.value;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/profile/${memberId}/${field}`;
      const headers = {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      };

      const data = { value: newValue }; // 서버에서 기대하는 데이터 형식에 맞게 조정

      await axios.put(url, newValue, { headers, withCredentials: true });
      dispatch(fetchProfile(memberId));
      console.log(`${field} update success`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const introduction = profileData?.introduction || "introduction";
  const email = profileData?.member?.email || "email";
  const role = profileData?.member?.member_role || "role";
  const nickname = profileData?.member?.nickname || "nickname";
  const memberAges = profileData?.memberAges || "Ages";
  const memberGender = profileData?.memberGender || "Gender";
  console.log(profileData);

  return (
    <div className="profile-update-container">
      <div className="update-user-info-page-title">
        <span>회원 정보 수정</span>
      </div>
      <div className="update-user-info-page">
        <div className="user-info-input-container">
          <div className="update-user-info-sub-title">
            <span>회원 정보</span>
          </div>
          <div className="profile-image-modal-container">
            <div className="profile-image-wrapper">
              <img
                src={profileImageUrl}
                alt="profileImage"
                className="profile-image"
              />
              <button
                className="change-photo-button"
                title="Change photo"
                onClick={() => setModalOpen(true)}
              >
                <PencilIcon />
              </button>
            </div>
            <div className="user-intro-container">
              <div className="user-intro-title">
                <label>
                  소개 <span className="required">*</span>
                </label>
              </div>
              <div className="user-intro-content">
                {isEditing["intro"] ? (
                  <input
                    type="text"
                    name={"intro"}
                    ref={refs["intro"]}
                    defaultValue={introduction}
                    className={`intro-input`}
                  />
                ) : (
                  <span>{introduction}</span>
                )}
              </div>
              <div className="user-intro-buttons">
                {isEditing["intro"] ? (
                  <button
                    className="profile-info-edit-btn"
                    onClick={() => handleConfirm("intro")}
                  >
                    저장
                  </button>
                ) : (
                  <button
                    className="profile-info-edit-btn"
                    onClick={() => handleEdit("intro")}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
            {modalOpen && (
              <Modal
                memberId={memberId}
                profileData={profileData}
                updateAvatar={updateAvatar}
                closeModal={() => setModalOpen(false)}
                setProfileImageUrl={setProfileImageUrl}
              />
            )}
          </div>
          <div className="user-info-container">
            {fields.map((field) => (
              <div className="user-form-group top-border" key={field.name}>
                <div className="user-info-form">
                  <label>
                    {field.label} <span className="required">*</span>
                  </label>
                  {isEditing[field.name] ? (
                    <input
                      type="text"
                      name={field.name}
                      ref={refs[field.name]}
                      defaultValue={profileData?.member[field.name] || ""}
                      className={`${field.name}-input`}
                    />
                  ) : (
                    <span>{profileData?.member[field.name] || ""}</span>
                  )}
                </div>
                <div>
                  {isEditing[field.name] ? (
                    <button
                      className="profile-info-edit-btn"
                      onClick={() => handleConfirm(field.name)}
                    >
                      저장
                    </button>
                  ) : (
                    <button
                      className="profile-info-edit-btn"
                      onClick={() => handleEdit(field.name)}
                    >
                      수정
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="user-form-group top-border">
              <div className="user-info-form">
                <label>
                  Email <span className="required">*</span>
                </label>
                <span>{email}</span>
              </div>
            </div>
            <div className="user-form-group top-border">
              <div className="user-info-form">
                <label>
                  Role <span className="required">*</span>
                </label>
                <span>{role}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="user-info-input-container">
          <div className="update-user-info-sub-title">
            <span>추가 정보</span>
          </div>
          <div className="user-info-container">
            {/* <div className="user-form-group top-border">
              <UserGenderSelect
                label="성별"
                data={profileData?.member?.gender || ""}
                onConfirm={() =>
                  handleConfirmSelect("gender", refs.gender.current.value)
                }
                ref={refs.gender}
              />
            </div> */}
            <div className="user-form-group top-border" key="gender">
              <div className="user-info-form">
                <label>
                  연령대
                  <span className="required">*</span>
                </label>
                {isEditing["age"] ? (
                  <select
                    className="form-select form-select-sm"
                    defaultValue={memberAges}
                    ref={refs["age"]}
                  >
                    <option value="AGE_0_TO_10">0세 ~ 10세 이하</option>
                    <option value="TEENS">10대</option>
                    <option value="TWENTIES">20대</option>
                    <option value="THIRTIES">30대</option>
                    <option value="FORTIES_AND_ABOVE">40대 이상</option>
                  </select>
                ) : (
                  <span>{memberAges}</span>
                )}
              </div>
              <div>
                {isEditing["age"] ? (
                  <button
                    className="profile-info-edit-btn"
                    onClick={() => handleConfirmSelect("age")}
                  >
                    저장
                  </button>
                ) : (
                  <button
                    className="profile-info-edit-btn"
                    onClick={() => handleEdit("age")}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
            <div className="user-form-group top-border" key="gender">
              <div className="user-info-form">
                <label>
                  성별
                  <span className="required">*</span>
                </label>
                {isEditing["gender"] ? (
                  <select
                    className="form-select form-select-sm"
                    defaultValue={memberGender}
                    ref={refs["gender"]}
                  >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </select>
                ) : (
                  <span>{memberGender}</span>
                )}
              </div>
              <div>
                {isEditing["gender"] ? (
                  <button
                    className="profile-info-edit-btn"
                    onClick={() => handleConfirmSelect("gender")}
                  >
                    저장
                  </button>
                ) : (
                  <button
                    className="profile-info-edit-btn"
                    onClick={() => handleEdit("gender")}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="profile-update-info-container">
          <div className="account-activate">
            <button>비활성화</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UpdateUserInfoPage };
