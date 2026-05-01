import type { Role } from "@/features/auth/schemas/authSchemas"

export type User = {
  id: string,
  email: string,
  fullName: string,
  role: Role,
  isVerified: boolean,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
}

export type Profile = {
  id: string,
  userId: string,
  bio: string,
  locationDistrict?: string,
  locationCity?: string,
  avatarUrl: string,
  phone: string,
  avgRating: number,
  totalJobsPosted: number,
  totalJobsCompleted: number,
  createdAt: string,
  updatedAt: string
}