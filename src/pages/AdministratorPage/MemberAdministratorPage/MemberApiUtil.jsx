import axios from "axios";
import {
  setMemberList,
  setPaymentHistoryListByAdmin,
  setPaymentHistoryListBySeller,
} from "../../../store";

export const fetchMemberLists = async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/members`,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        withCredentials: true,
      }
    );
    dispatch(setMemberList(response.data));
  } catch (error) {
    console.error(`Error fetching MemberLists:`, error);
  }
};

export const fetchPaymentHistoryListByAdmin = async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/paymenthistory/admin`,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        withCredentials: true,
      }
    );
    dispatch(setPaymentHistoryListByAdmin(response.data));
  } catch (error) {
    console.error(`Error fetching Admin PaymentHistoryList:`, error);
  }
};

export const fetchPaymentHistoryListBySeller = async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/paymenthistory/seller`,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        withCredentials: true,
      }
    );
    dispatch(setPaymentHistoryListBySeller(response.data));
  } catch (error) {
    console.error(`Error fetching Seller PaymentHistoryList :`, error);
  }
};

export function calculateDaysWithUs(joinedDate, lastLoginDate) {
  if (joinedDate === "가입날짜" || lastLoginDate === "최근로그인날짜") {
    return "N/A";
  }

  const joined = new Date(joinedDate);
  const lastLogin = new Date(lastLoginDate);
  // 날짜에 하루를 추가
  joined.setDate(joined.getDate());
  lastLogin.setDate(lastLogin.getDate() + 1);
  // 가입 날짜와 최근 로그인 날짜를 계산.
  const diffTime = Math.abs(lastLogin - joined);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일수로 변환

  return diffDays + " Days";
}
