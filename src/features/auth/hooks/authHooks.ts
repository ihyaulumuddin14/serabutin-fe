import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "../services/authServices";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../stores/authStores";
import {
  setAuthAccessToken,
  showAuthError,
  showAuthSuccess,
} from "../utils/authUtils";
import { userKeys } from "@/features/user/queries/userQueryKeys";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      showAuthSuccess(data.message || "Register berhasil");
    },
    onError: (error) => {
      showAuthError(error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      showAuthSuccess(data.message || "Login berhasil");

      // Set access token to axios instance for authenticated requests
      setAuthAccessToken(data.data.accessToken);

      // optimistic ui
      queryClient.setQueryData(userKeys.me(), (old) => ({
        ...(old ?? {}),
        user: data.data.user,
      }));
      setAuth(data.data.user.role, true);
      await new Promise((res) => {
        setTimeout(() => {
          res(null);
          navigate(callbackUrl || "/jobs");
        }, 1000);
      });
    },
    onError: (error) => {
      showAuthError(error);
    },
  });
};

export const useVerifyUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyUser,
    onSuccess: async () => {
      showAuthSuccess("Verifikasi berhasil, mengalihkan ke halaman login...");
      new Promise((res) => {
        setTimeout(() => {
          res(null);
          navigate("/login");
        }, 2000);
      });
    },
    onError: (error) => {
      showAuthError(error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      setAuthAccessToken();
      logout();

      navigate("/", { replace: true });
      showAuthSuccess("Logout berhasil");
    },
  });
};
