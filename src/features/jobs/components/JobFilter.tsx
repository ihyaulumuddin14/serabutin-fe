import { useRegencies } from "@/features/user/hooks/addressHooks";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { useCategory } from "../hooks/jobHooks";
import {
  FilterJobSchema,
  type FilterJobCredentials,
} from "../schemas/filterJobSchemas";
import {
  buildJobFilterSearchParams,
  parseJobFilterParams,
} from "../utils/jobFilterParams";

const JobFilter = ({
  className,
  setIsOpenFilterDrawer,
}: {
  className?: string;
  setIsOpenFilterDrawer?: (open: boolean) => void;
}) => {
  const {
    data: regencies,
    isLoading: isRegenciesLoading,
    isError: isRegenciesError,
    error: regenciesError,
  } = useRegencies();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategory();
  const [searchParams] = useSearchParams();
  const filterParams = parseJobFilterParams(searchParams);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FilterJobCredentials>({
    resolver: zodResolver(FilterJobSchema) as Resolver<FilterJobCredentials>,
    mode: "onChange",
    defaultValues: {
      categorySlug: filterParams.categorySlug ?? undefined,
      city: filterParams.city ?? undefined,
      budgetMin: filterParams.budgetMin ?? undefined,
      budgetMax: filterParams.budgetMax ?? undefined,
      dateFrom: filterParams.dateFrom ?? undefined,
      dateTo: filterParams.dateTo ?? undefined,
      q: filterParams.q ?? undefined,
    },
  });
  const dateFromValue = useWatch({ control, name: "dateFrom" });
  const dateToValue = useWatch({ control, name: "dateTo" });

  const handleFilterSubmit = (data: FilterJobCredentials) => {
    const queryString = buildJobFilterSearchParams(data).toString();
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
    navigate(newUrl);
  };

  const handleReset = () => {
    reset({
      categorySlug: undefined,
      city: undefined,
      budgetMin: undefined,
      budgetMax: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      q: undefined,
    });
    navigate(window.location.pathname);
  };

  return (
    <div
      className={`w-full h-fit bg-card flex flex-col justify-center p-4 sm:p-6 shadow-md rounded-md ${className}`}
    >
      <h3 className="text-muted-foreground text-[12px] pl-2 border-l-2 border-primary font-bold tracking-[1.2px]">
        FILTER PENCARIAN
      </h3>

      <form
        className="w-full mt-7"
        onSubmit={handleSubmit(handleFilterSubmit)}
      >
        <FieldGroup>
          <Field>
            <FieldLabel>Rentang Waktu Posting</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-range"
                  className="justify-between px-2.5 font-normal bg-background hover:scale-100!"
                >
                  {dateFromValue ? (
                    dateToValue ? (
                      <>
                        {format(dateFromValue, "MM/dd/yyyy")} -{" "}
                        {format(dateToValue, "MM/dd/yyyy")}
                      </>
                    ) : (
                      format(dateFromValue, "MM/dd/yyyy")
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      mm/dd/yyyy - mm/dd/yyyy
                    </span>
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
                  name="dateFrom"
                  render={({ field }) => (
                    <Calendar
                      mode="range"
                      defaultMonth={
                        field.value ? new Date(field.value) : new Date()
                      }
                      selected={{
                        from: field.value ? new Date(field.value) : undefined,
                        to: dateToValue ? new Date(dateToValue) : undefined,
                      }}
                      onSelect={(range) => {
                        field.onChange(
                          range?.from
                            ? format(range.from, "yyyy-MM-dd")
                            : undefined,
                        );
                        setValue(
                          "dateTo",
                          range?.to
                            ? format(range.to, "yyyy-MM-dd")
                            : undefined,
                        );
                      }}
                      numberOfMonths={2}
                    />
                  )}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <Field>
            <FieldLabel>Rentang Budget (Rp)</FieldLabel>
            <div className="w-full flex gap-3">
              <Controller
                control={control}
                name="budgetMin"
                render={({ field }) => (
                  <Input
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^\d*$/.test(value)) {
                        field.onChange(value === "" ? undefined : value);
                      }
                    }}
                    className="bg-background"
                    placeholder="Min."
                    inputMode="numeric"
                  />
                )}
              />
              <Controller
                control={control}
                name="budgetMax"
                render={({ field }) => (
                  <Input
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^\d*$/.test(value)) {
                        field.onChange(value === "" ? undefined : value);
                      }
                    }}
                    className="bg-background"
                    placeholder="Maks."
                    inputMode="numeric"
                  />
                )}
              />
            </div>
            {errors.budgetMin?.message && (
              <FieldError className="text-xs text-destructive">
                *{errors.budgetMin?.message}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Kota/Wilayah</FieldLabel>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(value) => onChange(value || undefined)}
                  value={value ?? ""}
                >
                  <SelectTrigger className="bg-background cursor-pointer">
                    <SelectValue placeholder="Pilih kota/kabupaten" />
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
          </Field>

          <Field>
            <FieldLabel>Kategori Jasa</FieldLabel>
            <Controller
              control={control}
              name="categorySlug"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(value) => onChange(value || undefined)}
                  value={value ?? ""}
                >
                  <SelectTrigger className="bg-background cursor-pointer">
                    <SelectValue placeholder="Pilih kategori jasa" />
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
                          value={category.slug}
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground p-4">
                        Tidak ada kategori jasa tersedia.
                      </p>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <Button
              type="submit"
              onClick={() =>
                setIsOpenFilterDrawer && setIsOpenFilterDrawer(false)
              }
            >
              Terapkan Filter
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default JobFilter;
