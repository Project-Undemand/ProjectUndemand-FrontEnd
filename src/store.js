import { configureStore, createSlice } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";

// Create the orderGroup slice
const orderGroupSlice = createSlice({
  name: "orderGroup",
  initialState: [], // Initial state is an empty array
  reducers: {
    setOrderGroup: (state, action) => {
      return action.payload; // Replace the current state with the new payload
    },
  },
});

// Create the wishList slice
const wishListSlice = createSlice({
  name: "wishList",
  initialState: [], // Initial state is an empty array
  reducers: {
    setWishList: (state, action) => {
      return action.payload; // Replace the current state with the new payload
    },
  },
});

// Create the myReviewList slice
const myReviewListSlice = createSlice({
  name: "myReviewList",
  initialState: [], // Initial state is an empty array
  reducers: {
    setMyReviewList: (state, action) => {
      return action.payload; // Replace the current state with the new payload
    },
  },
});

// Create the addressList slice
const addressListSlice = createSlice({
  name: "addressList",
  initialState: [], // Initial state is an empty array
  reducers: {
    setAddressList: (state, action) => {
      return action.payload; // Replace the current state with the new payload
    },
  },
});

// Create the addressList slice
const memberListSlice = createSlice({
  name: "memberList",
  initialState: [], // Initial state is an empty array
  reducers: {
    setMemberList: (state, action) => {
      return action.payload; // Replace the current state with the new payload
    },
  },
});

// 주소 목록 상태를 설정하는 액션 생성자
export const { setAddressList } = addressListSlice.actions;
// 사용자의 리뷰 목록 상태를 설정하는 액션 생성자
export const { setMyReviewList } = myReviewListSlice.actions;
// 위시리스트 상태를 설정하는 액션 생성자
export const { setWishList } = wishListSlice.actions;
// 결제 내역 그룹 상태를 설정하는 액션 생성자
export const { setOrderGroup } = orderGroupSlice.actions;
// 회원 목록 상태를 설정하는 액션 생성자
export const { setMemberList } = memberListSlice.actions;

// Configure the Redux store
const store = configureStore({
  reducer: {
    profile: profileReducer, // Include the profile slice reducer
    orderGroup: orderGroupSlice.reducer, // Include the orderGroup slice reducer
    wishList: wishListSlice.reducer, // Include the wishList slice reducer
    myReviewList: myReviewListSlice.reducer, // Include the myReviewList slice reducer
    addressList: addressListSlice.reducer, // Include the addressList slice reducer
    memberList: memberListSlice.reducer, // Include the memberList slice reducer
  },
});

// Export the store as the default export
export default store;
