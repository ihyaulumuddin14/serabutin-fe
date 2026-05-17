import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { useRegencies, useDistricts } from "@/features/user/hooks/addressHooks";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCategory, usePostJob } from "../hooks/jobHooks";
import {
  PostJobSchema,
  type PostJobCredentials,
} from "../schemas/postJobSchemas";
import { useNavigate } from "react-router";

const PostJobForm = () => {
  const navigate = useNavigate();

  const defaultValues: Partial<PostJobCredentials> = {
    title: "",
    description: "",
    categoryId: "",
    locationCity: "",
    locationDistrict: "",
    startAt: "",
    deadlineAt: "",
    workersNeeded: undefined,
    budgetMin: undefined,
    budgetMax: undefined,
  };

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PostJobCredentials>({
    resolver: zodResolver(PostJobSchema) as Resolver<PostJobCredentials>,
    mode: "onChange",
    defaultValues,
  });

  const startAtValue = useWatch({ control, name: "startAt" });
  const deadlineAtValue = useWatch({ control, name: "deadlineAt" });
  const locationCityValue = useWatch({ control, name: "locationCity" });

  const { mutate: createPostJob, isPending } = usePostJob();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategory();
  const {
    data: regencies,
    isLoading: isRegenciesLoading,
    isError: isRegenciesError,
    error: regenciesError,
  } = useRegencies();

  const regencyId = useMemo(() => {
    const selectedRegency = regencies?.find(
      (r) => r.nama === locationCityValue,
    );
    return selectedRegency?.kode;
  }, [regencies, locationCityValue]);

  const {
    data: districts,
    isLoading: isDistrictsLoading,
    isError: isDistrictsError,
    error: districtsError,
  } = useDistricts(regencyId || "");

  const onSubmit = (data: PostJobCredentials) => {
    createPostJob(data, {
      onSuccess: () => {
        reset(defaultValues);
        handleBack();
      },
    });
  };

  const handleBack = () => {
    navigate("/jobs");
  }

  return (
    <form
      className="w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel>Judul pekerjaan</FieldLabel>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Bersih-bersih rumah 2 lantai"
                error={errors.title?.message}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel>Deskripsi</FieldLabel>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value ?? ""}
                className="min-h-28 resize-none text-sm"
                placeholder="Jelaskan detail pekerjaan, kondisi lokasi, alat yang disediakan, dan catatan penting lainnya..."
              />
            )}
          />
          {errors.description?.message && (
            <FieldError className="text-xs">
              * {errors.description.message}
            </FieldError>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Kategori</FieldLabel>
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(val) => onChange(val || "")}
                  value={value ?? ""}
                >
                  <SelectTrigger className="bg-background cursor-pointer">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {isCategoriesLoading ? (
                      <SelectItem
                        value="loading"
                        disabled
                      >
                        Memuat kategori...
                      </SelectItem>
                    ) : isCategoriesError ? (
                      <SelectItem
                        value="error"
                        disabled
                      >
                        {categoriesError instanceof Error
                          ? categoriesError.message
                          : "Gagal memuat kategori."}
                      </SelectItem>
                    ) : categories?.length ? (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground p-4">
                        Tidak ada kategori tersedia.
                      </p>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId?.message && (
              <FieldError className="text-xs">
                * {errors.categoryId.message}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Lokasi</FieldLabel>
            <Controller
              control={control}
              name="locationCity"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(val) => {
                    if (val !== value) {
                      setValue("locationDistrict", "");
                    }
                    onChange(val || "");
                  }}
                  value={value ?? ""}
                >
                  <SelectTrigger className="bg-background cursor-pointer">
                    <SelectValue placeholder="Pilih lokasi" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {isRegenciesLoading ? (
                      <SelectItem
                        value="loading"
                        disabled
                      >
                        Memuat kota/kabupaten...
                      </SelectItem>
                    ) : isRegenciesError ? (
                      <SelectItem
                        value="error"
                        disabled
                      >
                        {regenciesError instanceof Error
                          ? regenciesError.message
                          : "Gagal memuat kota/kabupaten."}
                      </SelectItem>
                    ) : (
                      regencies?.map((regency) => (
                        <SelectItem
                          key={regency.kode}
                          value={regency.nama}
                        >
                          {regency.nama}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.locationCity?.message && (
              <FieldError className="text-xs">
                * {errors.locationCity.message}
              </FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>Kecamatan</FieldLabel>
          <Controller
            control={control}
            name="locationDistrict"
            render={({ field: { onChange, value } }) => (
              <Select
                onValueChange={(val) => onChange(val || "")}
                value={value ?? ""}
                disabled={!locationCityValue}
              >
                <SelectTrigger className="bg-background cursor-pointer">
                  <SelectValue placeholder="Pilih kecamatan" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {isDistrictsLoading ? (
                    <SelectItem
                      value="loading"
                      disabled
                    >
                      Memuat kecamatan...
                    </SelectItem>
                  ) : isDistrictsError ? (
                    <SelectItem
                      value="error"
                      disabled
                    >
                      {districtsError instanceof Error
                        ? districtsError.message
                        : "Gagal memuat kecamatan."}
                    </SelectItem>
                  ) : (
                    districts?.map((district) => (
                      <SelectItem
                        key={district.kode}
                        value={district.nama}
                      >
                        {district.nama}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationDistrict?.message && (
            <FieldError className="text-xs">
              * {errors.locationDistrict.message}
            </FieldError>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Dimulai</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between px-2.5 font-normal bg-background hover:scale-100! text-sm"
                >
                  {startAtValue ? (
                    format(new Date(startAtValue), "MM/dd/yyyy")
                  ) : (
                    <span className="text-muted-foreground">mm/dd/yyyy</span>
                  )}
                  <CalendarIcon color="#9A8F85" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Controller
                  control={control}
                  name="startAt"
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      defaultMonth={
                        field.value ? new Date(field.value) : new Date()
                      }
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                    />
                  )}
                />
              </PopoverContent>
            </Popover>
            {errors.startAt?.message && (
              <FieldError className="text-xs">
                * {errors.startAt.message}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Selesai</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between px-2.5 font-normal bg-background hover:scale-100! text-sm"
                >
                  {deadlineAtValue ? (
                    format(new Date(deadlineAtValue), "MM/dd/yyyy")
                  ) : (
                    <span className="text-muted-foreground">mm/dd/yyyy</span>
                  )}
                  <CalendarIcon color="#9A8F85" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Controller
                  control={control}
                  name="deadlineAt"
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      defaultMonth={
                        field.value ? new Date(field.value) : new Date()
                      }
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                    />
                  )}
                />
              </PopoverContent>
            </Popover>
            {errors.deadlineAt?.message && (
              <FieldError className="text-xs">
                * {errors.deadlineAt.message}
              </FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>Jumlah pekerja yang dibutuhkan</FieldLabel>
          <Controller
            control={control}
            name="workersNeeded"
            render={({ field }) => (
              <Input
                value={field.value ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d*$/.test(value)) {
                    field.onChange(value === "" ? undefined : Number(value));
                  }
                }}
                placeholder="2 / 3 / 4"
                inputMode="numeric"
                error={errors.workersNeeded?.message}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel>Rentang Budget</FieldLabel>
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center">
            <Controller
              control={control}
              name="budgetMin"
              render={({ field }) => (
                <Input
                  nominal
                  prefixText="Rp."
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (/^\d*$/.test(value)) {
                      field.onChange(value === "" ? undefined : Number(value));
                    }
                  }}
                  className="bg-background"
                  placeholder="Budget minimum"
                  inputMode="numeric"
                />
              )}
            />
            <span className="text-center text-sm text-muted-foreground min-w-fit">
              s/d
            </span>
            <Controller
              control={control}
              name="budgetMax"
              render={({ field }) => (
                <Input
                  nominal
                  prefixText="Rp."
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (/^\d*$/.test(value)) {
                      field.onChange(value === "" ? undefined : Number(value));
                    }
                  }}
                  className="bg-background"
                  placeholder="Budget maksimum"
                  inputMode="numeric"
                />
              )}
            />
          </div>
          {errors.budgetMin?.message && (
            <FieldError className="text-xs">
              * {errors.budgetMin.message}
            </FieldError>
          )}
        </Field>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            className="flex-4 font-bold text-sm"
            isLoading={isPending}
          >
            Posting
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 text-sm"
            onClick={handleBack}
          >
            Batal
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Setelah diposting, kebutuhan jasa akan tampil di daftar utama dan bisa
          dilihat oleh para pekerja.
        </p>
      </FieldGroup>
    </form>
  );
};

export default PostJobForm;
