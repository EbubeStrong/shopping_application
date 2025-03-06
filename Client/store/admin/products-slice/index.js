import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:3000/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      "http://localhost:3000/api/admin/products/get"
    );
    // console.log(result, "result")
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      console.log("🚀 API Call: Editing product", id, formData);
      const result = await axios.put(
        `http://localhost:3000/api/admin/products/edit/${id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return result.data;
    } catch (error) {
      console.error("❌ Edit error in thunk:", error);

      console.log("👉 Returning rejection:", error.response?.data || "Edit failed");
      return rejectWithValue(error.response?.data || "Edit failed");
    }
  }
);




export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.delete(
        `http://localhost:3000/api/admin/products/delete/${id}`
      );
      return result?.data;
    } catch (error) {
      console.error("❌ Delete product failed:", error);
      return rejectWithValue(error.response?.data || "Error deleting product");
    }
  }
);

const AdminProductsSlice = createSlice({
  name: "/adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
          // console.log("API Response:", action.payload);


        state.isLoading = false;
        state.productList = action.payload || [];
      })

      .addCase(fetchAllProducts.rejected, (state, action) => {
        // console.log(action.payload);

        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
