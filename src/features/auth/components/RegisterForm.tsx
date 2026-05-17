import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { useRegister } from "../hooks/authHooks";
import {
  RegisterSchema,
  type RegisterCredentials,
} from "../schemas/authSchemas";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      role: "client",
    },
  });
  const { mutate: mutateRegister, isPending: isPendingRegister } =
    useRegister();

  const handleRegisterSubmit = (data: RegisterCredentials) => {
    mutateRegister(data);
  };

  return (
    <form onSubmit={handleSubmit(handleRegisterSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel className="uppercase text-secondary-foreground">
            Pilih Peran
          </FieldLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Tabs
                defaultValue="client"
                onValueChange={field.onChange}
                value={field.value}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="client">Klien</TabsTrigger>
                  <TabsTrigger value="worker">Pekerja</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />
        </Field>
        <Field>
          <FieldLabel
            icon={<Mail size={16} />}
            htmlFor="email"
          >
            Email
          </FieldLabel>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="contoh@email.com"
            error={errors.email?.message}
          />
        </Field>
        <Field>
          <FieldLabel
            icon={<UserRound size={16} />}
            htmlFor="username"
          >
            Nama Pengguna
          </FieldLabel>
          <Input
            {...register("fullName")}
            id="fullName"
            type="text"
            placeholder="Nama pengguna"
            error={errors.fullName?.message}
          />
        </Field>
        <Field>
          <FieldLabel
            icon={<LockKeyhole size={16} />}
            htmlFor="password"
          >
            Password
          </FieldLabel>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Minimal 8 karakter"
            error={errors.password?.message}
          />
        </Field>

        <FieldSeparator />

        <Button
          size={"lg"}
          type="submit"
          isLoading={isPendingRegister}
          disabled={isPendingRegister}
        >
          Daftar Sekarang
        </Button>
        
        <FieldDescription className="text-center">
          Sudah punya akun?{" "}
          <Link
            replace
            to="/login"
            className="text-primary font-semibold no-underline!"
          >
            Masuk
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
