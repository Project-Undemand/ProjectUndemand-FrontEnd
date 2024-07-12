import React from "react";
import "./UpdateUserInfoPage.css";

export const UserInfo = ({ label, data, onEdit }) => (
  <div className="profile-info-container">
    <div className="profile-checkbox">
      <div className="userinfo-checkbox">
        <span>{label}</span>
        <span>{data || "없음"}</span>
      </div>
      <button className="profile-info-edit-btn" onClick={onEdit}>
        수정
      </button>
    </div>
  </div>
);

export const UserInfoInput = React.forwardRef(
  ({ label, type, data, onConfirm }, ref) => (
    <div className="profile-info-container">
      <div className="profile-checkbox">
        <div className="uii-container">
          <span>{label}</span>
          <div className="uii-cover">
            <input type={type} defaultValue={data} ref={ref} />
          </div>
        </div>
        <button className="profile-info-confirm-btn" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  )
);

export const UserAgeSelect = React.forwardRef(
  ({ label, data, onConfirm }, ref) => (
    <div className="profile-info-container">
      <div className="profile-checkbox">
        <div className="uii-container">
          {/* <span>{label}</span> */}
          <select
            className="form-select form-select-sm"
            defaultValue={data}
            ref={ref}
          >
            <option value="AGE_0_TO_10">0세 ~ 10세 이하</option>
            <option value="TEENS">10대</option>
            <option value="TWENTIES">20대</option>
            <option value="THIRTIES">30대</option>
            <option value="FORTIES_AND_ABOVE">40대 이상</option>
          </select>
        </div>
        <button className="profile-info-confirm-btn" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  )
);

export const UserGenderSelect = React.forwardRef(
  ({ label, data, onConfirm }, ref) => (
    <div className="profile-info-container">
      <div className="profile-checkbox">
        <div className="uii-container">
          {/* <span>{label}</span> */}
          <select
            className="form-select form-select-sm"
            defaultValue={data}
            ref={ref}
          >
            <option value="MAN">MAN | 남자</option>
            <option value="WOMAN">WOMAN | 여자</option>
            <option value="ETC">ETC | 공통</option>
          </select>
        </div>
        <button className="profile-info-confirm-btn" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  )
);

export const UserDataFormat = React.forwardRef(
  ({ label, type, data, onEdit, onConfirm, isEditing }, ref) => {
    const renderInputComponent = () => {
      switch (label) {
        case "연령대":
          return (
            <UserAgeSelect
              label={label}
              data={data}
              onConfirm={onConfirm}
              ref={ref}
            />
          );
        case "성별":
          return (
            <UserGenderSelect
              label={label}
              data={data}
              onConfirm={onConfirm}
              ref={ref}
            />
          );
        default:
          return (
            <UserInfoInput
              label={label}
              type={type}
              data={data}
              onConfirm={onConfirm}
              ref={ref}
            />
          );
      }
    };

    return (
      <div className="profile-info-data-container">
        {isEditing ? (
          renderInputComponent()
        ) : (
          <UserInfo label={label} data={data} onEdit={onEdit} />
        )}
      </div>
    );
  }
);
