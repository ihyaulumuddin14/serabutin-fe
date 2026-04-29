import { z } from "zod";

const RoleEnum = z.enum(["client", "worker"])

export const RegisterSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nama lengkap harus diisi")
    .min(3, "Nama lengkap minimal 3 karakter"),
  role: RoleEnum,
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Email tidak valid"),
  password: z
    .string()
    .min(1, "Password harus diisi")
    .min(8, "Password minimal 8 karakter")
  })
  
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Email tidak valid"),
  password: z
    .string()
    .min(1, "Password harus diisi")
    .min(8, "Password minimal 8 karakter")
})
  
export const VerifySchema = z.object({
  token: z
    .string()
  })


export type LoginCredentials = z.infer<typeof LoginSchema>
export type RegisterCredentials = z.infer<typeof RegisterSchema>
export type VerifyCredentials = z.infer<typeof VerifySchema>
export type Role = z.infer<typeof RoleEnum>;