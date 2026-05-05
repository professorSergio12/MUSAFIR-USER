import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  setCurrentUser,
  logout as logoutAction,
} from "../redux/user/userSlice";
import {
  signup,
  signin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleAuth,
  logout,
} from "../api/authApi";

export const useSignup = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: (data) => {
      console.log("Signup success:", data);
      dispatch(setCurrentUser(data));
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
  });
};

export const useSignin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => signin(data),
    onSuccess: (data) => {
      console.log("Signin success:", data);
      dispatch(setCurrentUser(data));
    },
    onError: (error) => {
      console.error("Signin error:", error);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data) => forgotPassword(data),
    onSuccess: (data) => {
      console.log("Forgot password success:", data);
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (data) => verifyOTP(data),
    onSuccess: (data) => {
      console.log("Verify OTP success:", data);
    },
    onError: (error) => {
      console.error("Verify OTP error:", error);
    },
  });
};

export const useResetPassword = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: (data) => {
      console.log("Reset password success:", data);
      dispatch(setCurrentUser(data));
    },
    onError: (error) => {
      console.error("Reset password error:", error);
    },
  });
};

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data) => googleAuth(data),
    onSuccess: (data) => {
      console.log("Google auth success:", data);
      dispatch(setCurrentUser(data));
    },
    onError: (error) => {
      console.error("Google auth error:", error);
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      console.log("Logout success");
      dispatch(logoutAction());
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};
