import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    orderList: [],
    orderDetails: null
}


export const getAllOrdersForAdmin = createAsyncThunk(
    "/order/getAllOrdersForAdmin",
    async () => {
      const response = await axios.get(
        `http://localhost:3000/api/admin/orders/get`,
      );
      return response.data
    }
  );
  
  export const getOrderDetailsForAdmin = createAsyncThunk(
    "/order/getOrderDetailsForAdmin",
    async (id) => {
      const response = await axios.get(
        `http://localhost:3000/api/admin/orders/details/${id}`,
      );
      return response.data
    }
  );


  export const updateOrderStatus = createAsyncThunk(
    "/order/updateOrderStatus",
    async ({id, orderStatus}) => {
      const response = await axios.put(
        `http://localhost:3000/api/admin/orders/update-status/${id}`,
        {orderStatus}
      );
      return response.data
    }
  );



const adminOrderSlice = createSlice({
    name: "adminOrderSlice",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null
        } 
    },
    extraReducers: (builder) => {
       builder 
       .addCase(getAllOrdersForAdmin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
            state.isLoading = false
            state.orderList = action.payload.data
        })
        .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
            state.isLoading = false
            state.orderList = []
            console.error("getAllOrdersForAdmin failed", action.error)
        })
    
    
        .addCase(getOrderDetailsForAdmin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
            state.isLoading = false
            // console.log("getOrderDetailsForAdmin fulfilled:", action.payload)
            state.orderDetails = action.payload.data
        })
        .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
            state.isLoading = false
            state.orderDetails = null
            console.error("getOrderDetailsForAdmin failed:", action.error)
        })
        
        .addCase(updateOrderStatus.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.isLoading = false
            // Update the orderDetails if it exists and matches the updated order
            if (state.orderDetails && state.orderDetails._id === action.payload.data._id) {
                state.orderDetails = action.payload.data
            }
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.isLoading = false
            console.error("updateOrderStatus failed:", action.error)
        })
    }
})

export const {resetOrderDetails} = adminOrderSlice.actions

export default adminOrderSlice.reducer