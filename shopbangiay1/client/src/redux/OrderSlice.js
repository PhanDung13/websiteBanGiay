import { createSlice } from "@reduxjs/toolkit";

const ProductSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
    loading: false,
    error: false,
  },
  reducers: {
    OrderRequest: (state) => {
      state.loading = true;
    },
    OrderSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    OrderError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const { reducer, actions } = ProductSlice;
export const { OrderError, OrderRequest, OrderSuccess } = actions;
export default reducer;
