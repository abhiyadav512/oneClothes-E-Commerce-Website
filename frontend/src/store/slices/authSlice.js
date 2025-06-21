import { createSlice } from "@reduxjs/toolkit";

// const user = JSON.parse(localStorage.getItem("user"));


const initialState = {
  token: localStorage.getItem("token") || null,
  user : JSON.parse(localStorage.getItem('user'))|| null  ,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
      // console.log(action.payload);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
