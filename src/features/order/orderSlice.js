import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
      dispatch(getCartQty());
      dispatch(
        showToastMessage({
          message: "주문이 완료되었습니다.",
          status: "success",
        })
      );
      return response.data.orderNum;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "주문 실패";

      dispatch(showToastMessage({ message: errorMessage, status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order/me");

      if (response.status !== 200) {
        throw new Error("주문 조회 실패");
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "주문 조회 실패");
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/order", {
        params: query,
      });

      if (response.status !== 200) {
        throw new Error("주문 조회 실패");
      }

      return {
        data: response.data.data,
        totalPageNum: response.data.totalPageNum,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "주문 조회 실패");
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });

      if (response.status !== 200) {
        throw new Error("상태 변경 실패");
      }

      dispatch(getOrderList());

      dispatch(
        showToastMessage({
          message: "주문 상태가 변경되었습니다",
          status: "success",
        })
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "상태 변경 실패");
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload;
        state.error = "";
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
