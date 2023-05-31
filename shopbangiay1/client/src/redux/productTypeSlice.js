import { createSlice } from "@reduxjs/toolkit";

const ProductSlice = createSlice({
  name: "productType",
  initialState: {
    product: [],
    loading: false,
    error: false,
  },
  reducers: {
    productTypeRequest: (state) => {
      state.loading = true;
    },
    productTyeSuccess: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
    productTyeError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const { reducer, actions } = ProductSlice;
export const { productTypeRequest, productTyeSuccess, productTyeError } =
  actions;
export default reducer;
