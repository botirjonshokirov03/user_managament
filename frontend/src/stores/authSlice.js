import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      localStorage.setItem("token", action.payload.access_token);

      console.log("Token stored:", action.payload.access_token); // ✅ Debugging
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      console.log("User logged out"); // ✅ Debugging
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
