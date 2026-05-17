import { z } from "zod";

export const PostJobSchema = z
  .object({
    title: z.string().min(1, "Judul pekerjaan harus diisi").max(50),
    description: z.string().min(1, "Deskripsi pekerjaan harus diisi").max(500),
    categoryId: z.string().min(1, "Kategori pekerjaan harus diisi"),
    locationDistrict: z.string().min(1, "Kecamatan harus diisi"),
    locationCity: z.string().min(1, "Kota harus diisi"),
    startAt: z.string().min(1, "Tanggal mulai harus diisi"),
    deadlineAt: z.string().min(1, "Tanggal selesai harus diisi"),
    workersNeeded: z.coerce
      .number("Jumlah pekerja harus diisi")
      .int()
      .positive("Jumlah pekerja harus lebih dari 0")
      .min(1, "Jumlah pekerja yang dibutuhkan harus diisi"),
    budgetMin: z.coerce
      .number("Budget harus berupa angka")
      .min(1, "Budget minimal adalah Rp 1")
      .optional(),
    budgetMax: z.coerce
      .number("Budget harus berupa angka")
      .min(1, "Budget minimal adalah Rp 1")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { budgetMin, budgetMax, startAt, deadlineAt } = data;
    if (
      typeof budgetMin === "number" &&
      typeof budgetMax === "number" &&
      budgetMin > budgetMax
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rentang budget tidak valid",
        path: ["budgetMin"],
      });
    }

    if (startAt && deadlineAt) {
      const startDate = new Date(startAt);
      const deadlineDate = new Date(deadlineAt);
      if (startDate < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal mulai tidak valid",
          path: ["startAt"],
        });
      } else if (startDate > deadlineDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rentang tanggal tidak valid",
          path: ["deadlineAt"],
        });
      }
    }
  });

export type PostJobCredentials = z.infer<typeof PostJobSchema>;