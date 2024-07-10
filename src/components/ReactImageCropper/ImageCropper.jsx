import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";
import axios from "axios";
import { fetchProfile, fetchProfileImage } from "../../profileSlice";
import "../../pages/UpdateUserInfoPage/UpdateUserInfoPage.css";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_INITIAL_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageCropper = ({
  memberId,
  profileData,
  updateAvatar,
  closeModal,
  setProfileImageUrl,
}) => {
  const imgRef = useRef(null); // 이미지 참조를 위한 useRef
  const previewCanvasRef = useRef(null); // 캔버스 참조를 위한 useRef
  const [imgSrc, setImgSrc] = useState(""); // 이미지 소스를 위한 상태
  const [crop, setCrop] = useState(); // 크롭 상태
  const [croppedImageUrl, setCroppedImageUrl] = useState(""); // 크롭된 이미지 URL 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isFileTooLarge, setIsFileTooLarge] = useState(false); // 파일 크기 초과 여부 상태
  const [initialFileTooLarge, setInitialFileTooLarge] = useState(false); // 최초 파일 크기 초과 여부 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 훅
  const dispatch = useDispatch(); // 리덕스 디스패치를 위한 훅

  // 파일 선택 핸들러
  const onSelectFile = (e) => {
    const file = e.target.files?.[0]; // 첫 번째 파일을 가져옴
    if (!file) return;

    if (file.size > MAX_INITIAL_FILE_SIZE) {
      setInitialFileTooLarge(true); // 최초 파일 크기가 5MB를 초과할 경우 상태 설정
      return;
    } else {
      setInitialFileTooLarge(false); // 최초 파일 크기가 5MB 이하일 경우 상태 초기화
    }

    const reader = new FileReader(); // FileReader 객체 생성

    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError(""); // 에러 초기화

        const { naturalWidth, naturalHeight } = e.currentTarget;

        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });

      setImgSrc(imageUrl); // 이미지 소스 설정
    });

    reader.readAsDataURL(file); // 파일을 Data URL 형식으로 읽기
  };

  // 이미지 로드 핸들러
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop); // 크롭 상태 설정
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 프로필 이미지 적용 핸들러
  const onClickApplyProfileImage = async () => {
    try {
      if (!croppedImageUrl) {
        setError("이미지가 선택되지 않았습니다.");
        return;
      }

      const authorization = localStorage.getItem("Authorization");
      const formData = new FormData();

      // URL에서 Blob을 직접 사용
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      console.log("Blob Size:", (blob.size / (1024 * 1024)).toFixed(2), "MB");

      formData.append("imageFile", blob, "croppedImage.jpeg");

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const uploadResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/profile/image/${memberId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authorization,
          },
          withCredentials: true,
        }
      );
      const profileImage = uploadResponse.data;

      if (uploadResponse.status === 200) {
        setProfileImageUrl(
          `${process.env.REACT_APP_BACKEND_URL_FOR_IMG}${profileImage.replace(
            "src/main/resources/static/",
            ""
          )}`
        );
      } else {
        setProfileImageUrl(
          "https://defaultst.imweb.me/common/img/default_profile.png"
        );
        console.log(
          "프로필 이미지 변경에 실패했습니다. status : " + uploadResponse.status
        );
      }

      //   setProfileImageUrl(uploadResponse.data);
      console.log("프로필 이미지 Path : ", uploadResponse.data);
      // 일정 시간 대기
      await delay(500);

      // 프로필 데이터와 이미지 다시 가져오기
      await Promise.all([
        dispatch(fetchProfile(memberId)),
        dispatch(fetchProfileImage(memberId)),
      ]);

      closeModal(); // 모달 닫기
      navigate("/user/mypage/profile"); // 마이 페이지로 이동
    } catch (error) {
      setError("프로필 이미지 변경 요청 중 오류가 발생했습니다.");
      console.error("프로필 이미지 변경 요청 중 오류가 발생했습니다:", error);
      console.error(
        "에러 응답 데이터:",
        error.response ? error.response.data : "없음"
      );
    }
  };

  // 프로필 이미지 크롭 헨들러
  const handleCropImage = async () => {
    setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );

    let quality = 0.8; // 초기 품질 설정
    let blob;

    do {
      // Blob으로 이미지 품질 조정
      const currentQuality = quality; // 루프 변수 캡처
      blob = await new Promise((resolve) => {
        previewCanvasRef.current.toBlob(
          (blob) => resolve(blob),
          "image/jpeg",
          currentQuality
        );
      });

      console.log(
        "Current quality:",
        quality,
        "Size:",
        (blob.size / (1024 * 1024)).toFixed(2),
        "MB"
      ); // MB 단위로 출력

      if (blob.size > MAX_FILE_SIZE) {
        quality -= 0.1; // 파일 크기가 너무 크면 품질 낮춤
      }
    } while (blob.size > MAX_FILE_SIZE && quality > 0);

    console.log(
      "Final quality:",
      quality,
      "Size:",
      (blob.size / (1024 * 1024)).toFixed(2),
      "MB"
    );

    const url = URL.createObjectURL(blob);
    setCroppedImageUrl(url); // 크롭된 이미지 URL 설정
    console.log(url);

    if (blob.size > MAX_FILE_SIZE) {
      setIsFileTooLarge(true); // 파일 크기가 2MB를 초과할 경우 상태 설정
    } else {
      setIsFileTooLarge(false); // 파일 크기가 2MB 이하일 경우 상태 설정
    }
  };

  return (
    <>
      <label className="file-input-container">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="file-input"
        />
      </label>
      {error && <p className="error-message">{error}</p>}
      {initialFileTooLarge && (
        <p className="error-message">
          파일 선택이 실패 했으며 5MB 이하의 이미지만 프로필 이미지로 설정할 수
          있습니다.
        </p>
      )}
      {imgSrc && (
        <div className="cropper-container">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "58vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button className="crop-button" onClick={handleCropImage}>
            Crop Image
          </button>
          {croppedImageUrl && !isFileTooLarge && (
            <button className="crop-button" onClick={onClickApplyProfileImage}>
              Apply Profile Image
            </button>
          )}
        </div>
      )}
      {crop && <canvas ref={previewCanvasRef} className="preview-canvas" />}
    </>
  );
};

export default ImageCropper;
