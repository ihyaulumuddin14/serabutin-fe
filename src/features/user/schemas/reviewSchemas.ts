import { z } from "zod";

export const ReviewSchema = z.object({
  assignmentId: z.string(),
  rating: z.number().min(1, { message: "Rating harus diisi" }).max(5, { message: "Rating maksimal 5" }),
  comment: z.string().max(500).optional(),
})

export type ReviewCredentials = z.infer<typeof ReviewSchema>