import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    isLoading: false,
    error: false,
  },
  reducers: {
    addCart: (state, action) => {
      const { cart } = state;
      const { product, quantity } = action.payload;
      const fileIndex = (product, size, id) => {
        let result = -1;
        product.forEach((productCart, index) => {
          if (
            productCart.product.size === size &&
            productCart.product._id === id
          ) {
            result = index;
          }
        });
        return result;
      };
      const index = fileIndex(cart, product.size, product._id);
      if (index !== -1) {
        //const number = Math.max(5, cart[index].quantity + quantity);
        cart[index].quantity += quantity;
      } else cart.unshift({ product, quantity });
      localStorage.setItem("cart", JSON.stringify(cart));
    },
    deleteCart: (state, action) => {
      const { cart } = state;
      const index = action.payload;
      const indexState = cart.findIndex(
        (product, indexCart) => indexCart === index
      );
      if (indexState !== -1) {
        cart.splice(indexState, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    },
    updateCart: (state, action) => {
      const { cart } = state;
      const { index, quantity } = action.payload;
      const indexState = cart.findIndex(
        (product, indexCart) => indexCart === index
      );
      if (indexState !== -1) {
        cart[indexState].quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    },
    removeCart: (state) => {
      const { cart } = state;

      cart.splice(0, cart.length);
      localStorage.setItem("cart", JSON.stringify(cart));
    },
  },
});
const { reducer, actions } = cartSlice;
export const { addCart, updateCart, deleteCart, removeCart } = actions;
export default reducer;
