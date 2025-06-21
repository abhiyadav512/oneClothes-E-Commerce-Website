import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const productId = action.payload;
      if (state.items.includes(productId)) {
        // Remove if exists
        state.items = state.items.filter((id) => id !== productId);
      } else {
        // Add if doesn't exist
        state.items.push(productId);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.items)); // persist
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const { toggleWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
