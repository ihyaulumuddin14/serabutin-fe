import { AxiosError } from "axios";
import { toast } from "sonner";
import privateApi from "@/shared/api/axiosInstance";

type ErrorWithMessage = { message?: string };

type ApiErrorResponse = {
  message?: string;
};

export const showAuthSuccess = (message: string) => {
  toast.dismiss();
  toast.success(message);
};

export const showAuthError = (
  error: unknown,
  fallbackMessage = "Terjadi kesalahan sistem",
) => {
  const message =
    error instanceof AxiosError
      ? (error.response?.data as ApiErrorResponse | undefined)?.message ||
        fallbackMessage
      : (error as ErrorWithMessage).message || fallbackMessage;

  toast.error(message);
};

export const setAuthAccessToken = (accessToken?: string) => {
  privateApi.defaults.headers.common["Authorization"] = accessToken
    ? `Bearer ${accessToken}`
    : undefined;
};
