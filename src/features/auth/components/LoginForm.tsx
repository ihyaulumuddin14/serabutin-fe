import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useLogin } from "../hooks/authHooks";
import { LoginSchema, type LoginCredentials } from "../schemas/authSchemas";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });
  const { mutate: mutateLogin, isPending: isPendingLogin } =
    useLogin();

  const handleLoginSubmit = (data: LoginCredentials) => {
    mutateLogin(data);
  };

  return (
    <form onSubmit={handleSubmit(handleLoginSubmit)}>
      <FieldGroup>
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
          isLoading={isPendingLogin}
          disabled={isPendingLogin}
          size={"lg"}
          type="submit"
        >
          Masuk
        </Button>
        
        <FieldDescription className="text-center">
          Belum punya akun?{" "}
          <Link
            replace
            to="/register"
            className="text-primary font-semibold no-underline!"
          >
            Registrasi
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
