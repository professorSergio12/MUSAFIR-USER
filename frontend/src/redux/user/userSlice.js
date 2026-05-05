import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const user = action.payload;
      state.currentUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
        profilePicture: user.profilePicture || null,
      };
    },

    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;
