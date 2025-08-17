import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAuthenticated: false,
  role: null,
  profileCompletion: 0,
  info: {},
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (s) => {
      s.isAuthenticated = true;
    },
    logout: (s) => {
      Object.assign(s, initialState);
    },
    setRole: (s, a) => {
      s.role = a.payload;
    },
    updateInfo: (s, a) => {
      s.info = { ...s.info, ...a.payload };
      s.profileCompletion = Math.min(100, Object.keys(s.info).length * 15);
    },
  },
});
export const { login, logout, setRole, updateInfo } = userSlice.actions;
export default userSlice.reducer;
