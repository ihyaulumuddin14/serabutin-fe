import type { JobAssignmentWorker, User } from "@/shared/types/entity.type";

export type WorkerToReview = {
  assignmentId: string;
  worker: JobAssignmentWorker;
  hasReviewed: boolean;
};

export type CategoryRating = {
  categoryId: string;
  categoryName: string;
  avgRating: number;
  reviewCount: number;
};

export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type WorkerProfile = User & { categoryRatings: CategoryRating[] };
