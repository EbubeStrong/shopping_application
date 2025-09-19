import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Login
export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// LogOut
export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {},
      {
      withCredentials: true,
    });
    return response.data;
  }
);


export const checkAuth = createAsyncThunk("/auth/checkauth", async (token) => {
  // // Read from local storage first
  // const storedUser = localStorage.getItem("auth");

  // if (storedUser) {
  //   return { success: true, user: JSON.parse(storedUser) }; 
  // }

  // Otherwise, check with the API
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );

  return response?.data;
});




const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    resetTokenAndCredentials: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null; // Store user info if needed
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Registration failed"; // Store error message
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {

          state.isLoading = false;

        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.token = action.payload.token
          sessionStorage.setItem('token', JSON.stringify(action.payload.token))

          // localStorage.setItem(
          //   "auth",
          //   JSON.stringify({
          //     email: action.payload.user.email,
          //     role: action.payload.user.role,
          //     id: action.payload.user.id,
          //     userName: action.payload.user.userName,    
          //   })
          // );
        } else {
          state.user = null;
          state.isAuthenticated = false;

        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error?.message || "Login failed";
        state.token =  null
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;

        state.user = !action.payload.success ? null : action.payload.user;

        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;

        state.user = null;
        state.isAuthenticated = false;

        // Clear authentication data from storage
        localStorage.removeItem("auth"); // Adjust if using a different key
        sessionStorage.removeItem("auth");

        // Optionally, reload the page to ensure state is reset
        // window.location.href = "/auth/login";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;

export default authSlice.reducer;
