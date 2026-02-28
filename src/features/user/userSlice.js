import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });

      const { token } = response.data;

      sessionStorage.setItem("token", token);

      dispatch(
        showToastMessage({
          message: "로그인 되었습니다.",
          status: "success",
        })
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (googleToken, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/user/google", {
        token: googleToken,
      });

      const { user, token } = response.data;

      sessionStorage.setItem("token", token);

      dispatch(
        showToastMessage({
          message: "로그인 되었습니다.",
          status: "success",
        })
      );

      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const logout = () => (dispatch) => {
  sessionStorage.removeItem("token");
  dispatch(logoutSuccess());
  dispatch(initialCart());
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user/register", {
        email,
        name,
        password,
      });
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다.",
          status: "success",
        })
      );
      navigate("/login");

      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.loginError = null;
      state.registrationError = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
        state.loading = false;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loginError = action.payload;
        state.loading = false;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});
export const { clearErrors, logoutSuccess } = userSlice.actions;
export default userSlice.reducer;
