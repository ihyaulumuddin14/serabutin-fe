import { toCamel, toSnake } from "@/shared/lib/case";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../schemas/authSchemas";
import axios from "axios";
import { privateApi } from "@/shared/api/axiosInstance";

export async function registerUser(data: RegisterCredentials) {
  const convertedPayload = toSnake(data);

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    convertedPayload,
  );

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Register gagal");

  return toCamel(response.data);
}

export async function loginUser(data: LoginCredentials) {
  const convertedPayload = toSnake(data);

  const response = await privateApi.post(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    convertedPayload,
  );

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Login gagal");

  return toCamel(response.data);
}

export async function verifyUser(token: string) {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/verify?token=${token}`,
  );

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Verifikasi gagal");

  return toCamel({
    status: "success",
    message: "Email berhasil diverifikasi. Silakan login.",
  });
}
