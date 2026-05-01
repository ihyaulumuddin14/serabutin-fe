import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { loginUser, registerUser, verifyUser } from "../services/authServices";
import privateApi from "@/shared/api/axiosInstance";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStores";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data.message || "Register berhasil");
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message || "Terjadi kesalahan sistem"
          : (error as Error).message,
      );
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore(state => state.setAuth)

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data.message || "Login berhasil");
      
      // Set access token to axios instance for authenticated requests
      const accessToken = data.accessToken;
      privateApi.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;

      // optimistic ui
      queryClient.setQueryData(["me"], (old) => ({
        ...(old ?? {}),
        user: data.user
      }));
      setAuth(data.user.role, true);
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message || "Terjadi kesalahan sistem"
          : (error as Error).message,
      );
    },
  });
};

export const useVerifyUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyUser,
    onSuccess: async () => {
      toast.dismiss();
      toast.success("Verifikasi berhasil, mengalihkan ke halaman login...");
      new Promise(res => {
        setTimeout(() => {
          toast.dismiss();
          res(null);
          navigate("/login");
        }, 2000)
      })
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message || "Terjadi kesalahan sistem"
          : (error as Error).message,
      );
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // Clear access token from axios instance
      queryClient.clear();
      privateApi.defaults.headers.common["Authorization"] = undefined;
      logout();
    },
    onSuccess: () => {
      navigate("/", { replace: true });
      toast.dismiss();
      toast.success("Logout berhasil");
    }
  });
}