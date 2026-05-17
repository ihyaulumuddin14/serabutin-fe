import { z } from "zod";

export const BidSchema = z.object({
  proposedPrice: z.coerce
    .number({ message: "Harga penawaran harus diisi" })
    .int()
    .min(1, "Harga penawaran harus diisi"),
  message: z.string().max(500, "Pesan maksimal 500 karakter").optional(),
});

export type BidCredentials = z.infer<typeof BidSchema>;
