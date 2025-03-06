import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  // isAuthenticated: true,
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

// Login
export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
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
    const response = await axios.post("http://localhost:3000/api/auth/logout", {
      withCredentials: true,
    });
    return response.data;
  }
);

// CheckAuth
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    const response = await axios.get(
      "http://localhost:3000/api/auth/check-auth",
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          // Expires: '0'
        },
      }
    );
    return response?.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload; 
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(registerUser.pending, (state) => {
    //     state.isLoading = true
    //   })
    //   .addCase(registerUser.fulfilled, (state, action) => {
    //     state.isLoading = false
    //     state.user = null
    //     state.isAuthenticated = true
    //   })
    //   .addCase(registerUser.rejected, (state, action) => {
    //     state.isLoading = false
    //     state.user = action.payload.user;
    //     state.isAuthenticated = false
    //     state.error = action.payload || "Registration failed";
    //   })
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null; // ✅ Store user info if needed
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Registration failed"; // ✅ Store error message
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      // .addCase(loginUser.fulfilled, (state, action) => {
      //   console.log(action);
      //   state.isLoading = false;
      //   state.user = !action.payload.success ? null : action.payload.user;
      //   state.isAuthenticated = !action.payload.success ? false : true;
      //   localStorage.setItem("auth", JSON.stringify(action.payload.user));
      // })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login Response:", action);
        state.isLoading = false;

        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;

          // ✅ Store auth data only if login is successful
          localStorage.setItem("auth", JSON.stringify(action.payload.user));
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log(action);
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

        // ✅ Clear authentication data from storage
        localStorage.removeItem("auth"); // Adjust if using a different key
        sessionStorage.removeItem("auth");

        // ✅ Optionally, reload the page to ensure state is reset
        // window.location.href = "/auth/login";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
