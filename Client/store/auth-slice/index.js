import {createSlice} from "@reduxjs/toolkit"
import { User } from "lucide-react";


const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null
}


const authSlice = createSlice({
  name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            
      }
  }
});

export const { setUser } = authSlice.actions

export default authSlice.reducer