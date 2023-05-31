import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
  },
});
const { reducer, actions } = userSlice;
export const { setUser } = actions;
export default reducer;
