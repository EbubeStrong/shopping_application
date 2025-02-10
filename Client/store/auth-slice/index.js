import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);
 
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true // ✅ Correct way
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload // ✅ Use response payload if needed
        state.isAuthenticated = true // ✅ Set authentication status correctly
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false // ✅ Should be false, not true
        state.user = null
        state.isAuthenticated = false
      })
}

});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
