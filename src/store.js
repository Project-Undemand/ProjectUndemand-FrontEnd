import { configureStore, createSlice } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";

// orderGroup 슬라이스 생성
const orderGroupSlice = createSlice({
  name: "orderGroup",
  initialState: [],
  reducers: {
    setOrderGroup: (state, action) => {
      return action.payload;
    },
  },
});

const wishListSlice = createSlice({
  name: "wishList",
  initialState: [],
  reducers: {
    setWishList: (state, action) => {
      return action.payload;
    },
  },
});

const myReviewListSlice = createSlice({
  name: "myReviewList",
  initialState: [],
  reducers: {
    setMyReviewList: (state, action) => {
      return action.payload;
    },
  },
});

const addressListSlice = createSlice({
  name: "addressList",
  initialState: [],
  reducers: {
    setAddressList: (state, action) => {
      return action.payload;
    },
  },
});

export const { setAddressList } = addressListSlice.actions;
export const { setMyReviewList } = myReviewListSlice.actions;
export const { setWishList } = wishListSlice.actions;
export const { setOrderGroup } = orderGroupSlice.actions;

const store = configureStore({
  reducer: {
    profile: profileReducer,
    orderGroup: orderGroupSlice.reducer,
    wishList: wishListSlice.reducer,
    myReviewList: myReviewListSlice.reducer,
    addressList: addressListSlice.reducer,
  },
});

export default store;
