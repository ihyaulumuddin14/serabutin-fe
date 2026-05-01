import { z } from "zod";

export const EditProfileCredentials = z
  .object({
    fullName: z.string().min(1, "Nama lengkap tidak boleh kosong"),
    bio: z.string().nullable(),
    locationCity: z.string().nullable(),
    locationDistrict: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    phone: z.string().nullable(),
  })
  .refine(
    (data) =>
      (data.locationCity && data.locationDistrict) ||
      (!data.locationCity && !data.locationDistrict),
    {
      message: "Kota dan kecamatan harus diisi bersamaan",
      path: ["locationDistrict"],
    },
  );

export type EditProfileSchema = z.infer<typeof EditProfileCredentials>;
