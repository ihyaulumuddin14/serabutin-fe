import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { loginUser, logoutUser, registerUser, verifyUser } from "../services/authServices";
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      toast.dismiss();
      toast.success(data.message || "Login berhasil");
      
      // Set access token to axios instance for authenticated requests
      const accessToken = data.data.accessToken;
      privateApi.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;

      // optimistic ui
      queryClient.setQueryData(["me"], (old) => ({
        ...(old ?? {}),
        user: data.data.user
      }));
      setAuth(data.data.user.role, true);
      await new Promise(res => {
        setTimeout(() => {
          res(null);
          navigate("/jobs");
        }, 1000)
      });
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
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      privateApi.defaults.headers.common["Authorization"] = undefined;
      logout();

      navigate("/", { replace: true });
      toast.dismiss();
      toast.success("Logout berhasil");
    }
  });
}