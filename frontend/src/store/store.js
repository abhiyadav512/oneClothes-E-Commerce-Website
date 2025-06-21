import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import wishlistReducer from "../store/slices/wishlistSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
