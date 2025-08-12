import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    isLoading: false,
    addressList: [],
}

// export const addNewAddress = createAsyncThunk(
//     "address/addAddress", async()=>({})
// )

export const addNewAddresses = createAsyncThunk(
    '/addresses/addNewAddress', async(formData) => {
        const response = await axios.post("http://localhost:3000/api/shop/address/add", formData)

        return response.data
    }
)
export const fetchAllAddresses = createAsyncThunk(
    '/addresses/fetchAllAddress', async(userId) => {
        const response = await axios.get(`http://localhost:3000/api/shop/address/get/${userId}`)

        return response.data
    }
)
export const editAddresses = createAsyncThunk(
    '/addresses/editAddress', async({userId, addressId, formData}) => {
        const response = await axios.put(`http://localhost:3000/api/shop/address/update/${userId}/${addressId}`, formData)

        return response.data
    }
)
export const deleteAddresses = createAsyncThunk(
    '/addresses/deleteAddress', async({userId, addressId}) => {
        const response = await axios.delete(`http://localhost:3000/api/shop/address/delete/${userId}/${addressId}`)

        return response.data
    }
)

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
        // addNewAddresses
        .addCase(addNewAddresses.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(addNewAddresses.fulfilled, (state, action) => {
          console.log(action);
          state.isLoading = false;
          // state.addressList = action.payload.data;
        })
        .addCase(addNewAddresses.rejected, (state) => {
          state.isLoading = false;
          // state.addressList = [];
        })
      
        // fetchAllAddresses
        .addCase(fetchAllAddresses.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchAllAddresses.fulfilled, (state, action) => {
          console.log(action);
          state.isLoading = false;
          state.addressList = action.payload.data;
        })
        .addCase(fetchAllAddresses.rejected, (state) => {
          state.isLoading = false;
          state.addressList = [];
        });
      
    }
})


export default addressSlice.reducer