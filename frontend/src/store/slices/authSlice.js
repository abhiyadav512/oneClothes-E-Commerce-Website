import { createSlice } from "@reduxjs/toolkit";
import { encryptUser, decryptUser } from "@/lib/secureStorage";

const token = localStorage.getItem("token") || null;
const encryptedUser = localStorage.getItem("user");
const user = encryptedUser ? decryptUser(encryptedUser) : null;

const initialState = {
  token,
  user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      const encrypted = encryptUser(action.payload);
      localStorage.setItem("user", encrypted);
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
