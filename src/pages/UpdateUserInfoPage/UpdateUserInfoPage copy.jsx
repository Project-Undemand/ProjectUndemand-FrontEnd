import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
// Component
import PencilIcon from "../../components/ReactImageCropper/PencilIcon.jsx";
import Modal from "../../components/ReactImageCropper/Modal.jsx";
import { UserDataFormat } from "./UpdateUserInfoInputBox.jsx";
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
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const genderRef = useRef(null);
  const ageRef = useRef(null);
  const nicknameRef = useRef(null);

  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );

  const dispatch = useDispatch(); // 리덕스 디스패치를 위한 훅

  const updateAvatar = (imgSrc) => {
    avatarUrl.current = imgSrc;
  };

  const handleEditGender = () => setIsEditingGender(true);
  const handleConfirmGender = async () => {
    setIsEditingGender(false);
    try {
      const newGender = genderRef.current.value;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/profile/${memberId}/gender`;
      const headers = {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      };

      await axios.put(url, newGender, { headers, withCredentials: true });
      dispatch(fetchProfile(memberId));
      console.log("Gender Put Seccess");
    } catch (error) {
      console.error("Error updating gender:", error);
    }
  };

  const handleEditAge = () => setIsEditingAge(true);
  const handleConfirmAge = async () => {
    setIsEditingAge(false);
    try {
      const newAge = ageRef.current.value;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/profile/${memberId}/age`;
      const headers = {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      };

      await axios.put(url, newAge, { headers, withCredentials: true });
      dispatch(fetchProfile(memberId));
      console.log("Age Put Seccess");
    } catch (error) {
      console.error("Error updating age:", error);
    }
  };

  const handleEditNickname = () => setIsEditingNickname(true);
  const handleConfirmNickname = async () => {
    setIsEditingNickname(false);
    try {
      const newNickname = nicknameRef.current.value;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/profile/${memberId}/nickname`;
      const headers = {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      };

      await axios.put(url, newNickname, {
        headers,
        withCredentials: true,
      });
      dispatch(fetchProfile(memberId));
      console.log("Nickname Put Seccess");
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  const email = profileData?.member?.email || "없음";
  const nickname = profileData?.member?.nickname || "없음";
  const memberAges = profileData?.memberAges || "없음";
  const memberGender = profileData?.memberGender || "없음";

  return (
    <div className="profile-update-container">
      <div className="update-user-info-page-title">
        <span>회원 정보 수정</span>
      </div>
      <div className="update-user-info-page">
        <div className="user-info-input-container">
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
            <UserDataFormat
              label="성별"
              type="text"
              data={memberGender}
              onEdit={handleEditGender}
              onConfirm={handleConfirmGender}
              isEditing={isEditingGender}
              ref={genderRef}
            />
            <UserDataFormat
              label="연령대"
              type="text"
              data={memberAges}
              onEdit={handleEditAge}
              onConfirm={handleConfirmAge}
              isEditing={isEditingAge}
              ref={ageRef}
            />
            <UserDataFormat
              label="닉네임"
              type="text"
              data={nickname}
              onEdit={handleEditNickname}
              onConfirm={handleConfirmNickname}
              isEditing={isEditingNickname}
              ref={nicknameRef}
            />
          </div>
        </div>
        <div className="profile-update-info-container">
          <div className="account-activate">
            <span>계정 비활성화</span>
            <button>비활성화</button>
          </div>
        </div>
        <div className="profile-update-info-container">
          <div className="account-activate">
            <span>휴대폰 인증</span>
            <button>인증하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UpdateUserInfoPage };
