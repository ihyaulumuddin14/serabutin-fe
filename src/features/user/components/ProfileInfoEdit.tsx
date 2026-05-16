/* eslint-disable react-hooks/incompatible-library */

import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProfileCredentials,
  type EditProfileSchema,
} from "../schemas/userSchemas";
import { useMe, useUpdateProfile } from "../hooks/userHooks";
import { useDistricts, useRegencies } from "../hooks/addressHooks";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useMemo } from "react";
import ProfileImageEdit from "./ProfileImageEdit";
import { Textarea } from "@/shared/components/ui/textarea";

export const ProfileInfoEdit = ({
  setIsEditing,
}: {
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const { user, profile } = useMe();
  const { mutate, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(EditProfileCredentials),
    defaultValues: {
      fullName: user?.fullName || "",
      bio: profile?.bio || "",
      phone: profile?.phone != null ? String(profile.phone) : null,
      locationCity: profile?.locationCity || null,
      locationDistrict: profile?.locationDistrict || null,
      avatarUrl: profile?.avatarUrl || "",
    },
  });

  const { data: regencies } = useRegencies();
  const cityValue = watch("locationCity");
  const districtValue = watch("locationDistrict");

  const regencyId = useMemo(() => {
    const selectedRegency = regencies?.find((r) => r.nama === cityValue);
    return selectedRegency?.kode;
  }, [regencies, cityValue]);

  const { data: districts } = useDistricts(regencyId || "");

  const onSubmit = (data: EditProfileSchema) => {
    mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <ProfileImageEdit />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
      >
        <FieldGroup>
          <Field>
            <FieldLabel>Nama Lengkap</FieldLabel>
            <Input
              {...register("fullName")}
              error={errors.fullName?.message}
            />
          </Field>
          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea
              className="resize-none"
              {...register("bio")}
            />
          </Field>
          {user?.role === "client" && (
            <Field>
              <FieldLabel>Nomor Telepon</FieldLabel>
              <Input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </Field>
          )}
          <Field>
            <FieldLabel>Kota/Kabupaten</FieldLabel>
            <Select
              onValueChange={(value) => {
                if (value !== cityValue) {
                  setValue("locationDistrict", null);
                }
                setValue("locationCity", value);
              }}
              value={cityValue ?? undefined}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={profile?.locationCity || "Pilih kota/kabupaten"}
                />
              </SelectTrigger>
              <SelectContent position="popper">
                {regencies?.map((regency) => (
                  <SelectItem
                    key={regency.kode}
                    value={regency.nama}
                  >
                    {regency.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Kecamatan</FieldLabel>
            <Select
              onValueChange={(value) => setValue("locationDistrict", value)}
              value={districtValue ?? undefined}
              disabled={!cityValue}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={profile?.locationDistrict || "Pilih kecamatan"}
                />
              </SelectTrigger>
              <SelectContent position="popper">
                {districts?.map((district) => (
                  <SelectItem
                    key={district.kode}
                    value={district.nama}
                  >
                    {district.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.locationDistrict && (
              <p className="text-xs text-destructive text-right">
                * {errors?.locationDistrict.message}
              </p>
            )}
          </Field>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant="ghost"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1 text-primary font-bold"
              variant={"ghost"}
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};
