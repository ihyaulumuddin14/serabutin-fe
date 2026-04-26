import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { LockKeyhole, Mail } from "lucide-react";
import { Link } from "react-router";
import { AuthCard } from "./AuthCard";

export default function LoginForm() {
  return (
    <AuthCard
      title="Masuk"
      description="Masuk ke akun anda"
    >
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel
              icon={<Mail size={16} />}
              htmlFor="email"
            >
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              required
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
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              required
            />
          </Field>

          <FieldSeparator />

          <Field>
            <Button
              size={"lg"}
              type="submit"
            >
              Masuk
            </Button>
            <FieldDescription className="text-center">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold no-underline!"
              >
                Registrasi
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
