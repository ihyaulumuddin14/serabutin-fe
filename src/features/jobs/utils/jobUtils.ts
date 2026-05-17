import { AxiosError } from "axios";
import { toast } from "sonner";

type ErrorWithMessage = { message?: string };

type ApiErrorResponse = {
  message?: string;
};

export const showJobSuccess = (message: string) => {
  toast.success(message);
};

export const showJobError = (
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
