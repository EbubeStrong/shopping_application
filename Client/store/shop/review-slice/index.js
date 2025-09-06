import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};


export const addReview = createAsyncThunk(
  "order/addProductReview", // action type (no leading slash needed)
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/shop/review/add",
        formData
      );
      console.log(response.data, "addReview response");
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


export const getReviews = createAsyncThunk(
  "/order/getProductReview",
  async (id) => {
    const result = await axios.get(`http://localhost:3000/api/shop/review/${id}`);
    return result?.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    resetAddReview: (state, action) => {
      state.reviews.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload;
      });
  },
});

export const { resetAddReview, setLoading, setError } = reviewSlice.actions;

export default reviewSlice.reducer;
