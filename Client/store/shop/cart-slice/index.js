import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (userId, productId, quantity) => {
    const response = await axios.post(
      "https://localhost:5000/api/shop/cart/add",
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await axios.get(
      `https://localhost:5000/api/shop/cart/get/${userId}`
    );
    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (userId, productId) => {
    const response = await axios.delete(
      `https://localhost:5000/api/shop/cart/${userId}/${productId}`
    );
    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async (userId, productId, quantity) => {
    const response = await axios.put(
      "https://localhost:5000/api/shop/cart/update-cart",
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

const shoppingCart = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems.push(action.payload);
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

        // for fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems.push(action.payload);
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

        // for update Cart Items
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems.push(action.payload);
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
        
        
        // for update Cart Items
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems.push(action.payload);
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCart.reducer;