import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });

      dispatch(
        showToastMessage({ message: "카트 추가 완료", status: "success" })
      );

      dispatch(getCartList());

      return response.data.cartItemQty;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "카트 추가 실패";

      dispatch(showToastMessage({ message: errorMessage, status: "error" }));

      return rejectWithValue(errorMessage);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);

      dispatch(
        showToastMessage({
          message: "상품이 삭제되었습니다.",
          status: "success",
        })
      );

      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "삭제 실패";

      dispatch(showToastMessage({ message: errorMessage, status: "error" }));

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });

      dispatch(getCartList());

      return { id, qty: value };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "수량 변경 실패";

      dispatch(showToastMessage({ message: errorMessage, status: "error" }));

      return rejectWithValue(errorMessage);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");

      return response.data.data.length;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload;

        state.totalPrice = action.payload.reduce((total, item) => {
          return total + item.productId.price * item.qty;
        }, 0);

        state.cartItemCount = action.payload.length;
        state.error = "";
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartList = state.cartList.filter(
          (item) => item._id !== action.payload
        );

        state.totalPrice = state.cartList.reduce((total, item) => {
          return total + item.productId.price * item.qty;
        }, 0);

        state.cartItemCount = state.cartList.length;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        const item = state.cartList.find(
          (item) => item._id === action.payload.id
        );

        if (item) {
          item.qty = action.payload.qty;
        }

        state.totalPrice = state.cartList.reduce((total, item) => {
          return total + item.productId.price * item.qty;
        }, 0);
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.cartItemCount = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
