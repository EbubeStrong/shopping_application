import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  searchResults: [],
};

export const getSearchResults = createAsyncThunk(
  "/products/getSearchResults",
  async (keyword) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`
    );
    // console.log(result, "result")
    return result?.data;
  }
);

const shopSearchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(getSearchResults.fulfilled, (state, action) => {
        // console.log(action.payload, "action.payload")

        (state.isLoading = false), (state.searchResults = action.payload.data);
      })

      .addCase(getSearchResults.rejected, (state, action) => {
        (state.isLoading = false), (state.searchResults = []);
      });
  },
});

export const { resetSearchResults } = shopSearchSlice.actions;

export default shopSearchSlice.reducer