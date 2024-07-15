import axios from "axios";
import {
  setAddressList,
  setMyReviewList,
  setWishList,
  setOrderGroup,
} from "../../store";

export const fetchWishLists = async (dispatch, memberId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/wishlist/${memberId}`,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
        withCredentials: true,
      }
    );

    dispatch(setWishList(response.data));
  } catch (error) {
    console.error(`Error fetching wishlist:`, error);
  }
};

export const fetchPaymentHistory = async (
  dispatch,
  memberId,
  setLocalOrderGroup,
  setProductInventory
) => {
  try {
    const authorization = localStorage.getItem("Authorization");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/paymenthistory/${memberId}`,
      {
        headers: {
          Authorization: authorization,
        },
        withCredentials: true,
      }
    );
    const groupedData = groupByOrderId(response.data);
    setLocalOrderGroup(groupedData);
    dispatch(setOrderGroup(groupedData));

    const fetchProductData = async () => {
      const inventories = [];
      for (const orderId in groupedData) {
        const products = groupedData[orderId].products;
        for (const product of products) {
          const productResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${product.productId}`
          );

          if (productResponse.status === 200) {
            const invenResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_BASE_URL}/inventory`,
              {
                headers: {
                  Authorization: localStorage.getItem("Authorization"),
                },
                withCredentials: true,
              }
            );

            const invenResData = invenResponse.data;
            const filteredInventory = invenResData.filter(
              (inven) =>
                parseInt(inven.productId) === parseInt(product.productId)
            );

            inventories.push(...filteredInventory);
          }
        }
      }
      setProductInventory(inventories);
    };

    fetchProductData();
  } catch (error) {
    console.error(`Error fetching payment history:`, error);
  }
};

export const fetchProductReviewData = async (dispatch, memberId) => {
  try {
    const authorization = localStorage.getItem("Authorization");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/review/user/${memberId}`,
      {
        headers: {
          Authorization: authorization,
        },
        withCredentials: true,
      }
    );
    dispatch(setMyReviewList(response.data));
  } catch (error) {
    console.error(`Error fetching product reviews:`, error);
  }
};

export const fetchAddressLists = async (dispatch, memberId) => {
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
    dispatch(setAddressList(response.data));
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }
};

// Helper function to group payments by orderId
const groupByOrderId = (paymentHistory) => {
  return paymentHistory.reduce((groups, payment) => {
    const {
      orderId,
      paymentId,
      memberId,
      buyerAddr,
      discount,
      merchantUid,
      ordererName,
      orderedAt,
      paiedAt,
      payMethod,
      phoneNumber,
      review,
      statusType,
      totalPrice,
      imagePath,
      productName,
      productPrice,
      productQuantity,
      option,
      productId,
      manufacturer,
    } = payment;

    if (!groups[orderId]) {
      groups[orderId] = {
        orderId,

        memberId,
        buyerAddr,
        discount,
        merchantUid,
        ordererName,
        orderedAt,
        paiedAt,
        payMethod,
        phoneNumber,
        statusType,
        totalPrice,
        products: [],
      };
    }

    groups[orderId].products.push({
      imagePath,
      productName,
      productPrice,
      manufacturer,
      productQuantity,
      option,
      productId,
      paymentId,
      review,
    });

    return groups;
  }, {});
};
