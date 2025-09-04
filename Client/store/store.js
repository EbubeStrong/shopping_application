// import { configureStore } from "@reduxjs/toolkit";

// import authReducer from "./auth-slice";
// import AdminProductsSlice from "./admin/products-slice/index";
// import shopProductsSlice from "./shop/product-slice/index";


// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     adminProducts: AdminProductsSlice,
//     shopProducts: shopProductsSlice,
//   },
// });

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from "./admin/products-slice/index";
import AdminOrderSlice from "./admin/order-slice/index";

import shopProductsSlice from "./shop/product-slice/index";
import shopCartSlice from "./shop/cart-slice/index";
import shopAddressSlice from "./shop/address-slice/index";
import shopOrderSlice from "./shop/order-slice/index";
import shopSearchSlice from "./shop/search-slice/index";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Persisting only auth
    
    adminProducts: AdminProductsSlice,
    adminOrder: AdminOrderSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Ignore non-serializable warnings
    }),
});

export const persistor = persistStore(store);
