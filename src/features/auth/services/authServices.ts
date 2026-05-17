import axios from "axios";
import { privateApi } from "@/shared/api/axiosInstance";
import { toCamel, toSnake } from "@/shared/lib/case";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../schemas/authSchemas";

const authBaseUrl = `${import.meta.env.VITE_API_URL}/auth`;

const ensureSuccess = <T extends { status?: string; message?: string }>(
  response: { data: T },
  fallbackMessage: string,
) => {
  if (response.data.status !== "success") {
    throw new Error(response.data?.message || fallbackMessage);
  }

  return response.data;
};

export async function registerUser(data: RegisterCredentials) {
  const convertedPayload = toSnake(data);

  const response = await axios.post(
    `${authBaseUrl}/register`,
    convertedPayload,
  );

  return toCamel(ensureSuccess(response, "Register gagal"));
}

export async function loginUser(data: LoginCredentials) {
  const convertedPayload = toSnake(data);

  const response = await axios.post(`${authBaseUrl}/login`, convertedPayload, {
    withCredentials: true,
  });

  return toCamel(ensureSuccess(response, "Login gagal"));
}

export async function verifyUser(token: string) {
  const response = await axios.get(`${authBaseUrl}/verify?token=${token}`);

  ensureSuccess(response, "Verifikasi gagal");

  return toCamel({
    status: "success",
    message: "Email berhasil diverifikasi. Silakan login.",
  });
}

export async function logoutUser() {
  const response = await privateApi.post("/auth/logout");

  return toCamel(ensureSuccess(response, "Logout gagal"));
}
