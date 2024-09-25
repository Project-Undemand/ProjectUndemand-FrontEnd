import axios from "axios";
import { setProductList, setInventoryList } from "../../../store";

export const fetchProductLists = async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/products`,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        withCredentials: true,
      }
    );
    dispatch(setProductList(response.data));
  } catch (error) {
    console.error(`Error fetching Product Lists:`, error);
  }
};

export const fetchInventoryLists = async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/Inventories`,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        withCredentials: true,
      }
    );
    dispatch(setInventoryList(response.data));
  } catch (error) {
    console.error(`Error fetching Inventory Lists:`, error);
  }
};
