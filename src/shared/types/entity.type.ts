import type { Role } from "@/features/auth/schemas/authSchemas"
import type { JobStatus } from "./common.type"
import type { BidStatus } from "@/features/user/types"

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

export type Review = {
  id: string,
  assignmentId: string,
  reviewer: {
    id: string,
    fullName: string,
    role: Role,
    createdAt: string,
    updatedAt: string
  },
  reviewee: {
    id: string,
    fullName: string,
    role: Role,
    createdAt: string,
    updatedAt: string
  },
  rating: number,
  comment: string,
  createdAt: string
}

export type Category = {
  id: string,
  name: string,
  slug: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
}

export type JobAssignment = {
  id: string,
  client: Omit<User, "email" | "isVerified" | "isActive"> & Partial<Pick<Profile, "phone">>,
  category: Category,
  title: string,
  description: string,
  budgetMin: number,
  budgetMax: number,
  workersNeeded: number,
  locationDistrict: string,
  locationCity: string,
  status: JobStatus,
  startAt: string,
  deadlineAt: string,
  createdAt: string,
  updatedAt: string
}

export type Bid = {
  id: string,
  worker: {
    id: string,
    fullName: string,
    role: Role,
    createdAt: string,
    updatedAt: string
  },
  proposedPrice: number,
  status: BidStatus,
  createdAt: string,
  updatedAt: string
}