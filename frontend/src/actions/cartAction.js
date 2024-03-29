import {
  ADD_TO_CART,
  EMPTY_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from "axios";
import backendEndpoint from "../config";

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`${backendEndpoint}/api/v1/product/${id}`);

  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.Stock,
      quantity,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// EMPTY CART
export const emptyCart = () => async (dispatch, getState) => {
  dispatch({
    type: EMPTY_CART,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
