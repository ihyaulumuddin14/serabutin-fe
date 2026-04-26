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
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link } from "react-router";
import { AuthCard } from "./AuthCard";

export default function RegisterForm() {
  return (
    <AuthCard
      title="Registrasi"
      description="Buat akun baru dan mulai sekarang"
    >
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel className="uppercase text-secondary-foreground">
              Pilih Peran
            </FieldLabel>
            <Tabs defaultValue="client">
              <TabsList className="w-full">
                <TabsTrigger value="client">Klien</TabsTrigger>
                <TabsTrigger value="worker">Pekerja</TabsTrigger>
              </TabsList>
            </Tabs>
          </Field>
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
              icon={<UserRound size={16} />}
              htmlFor="username"
            >
              Nama Pengguna
            </FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="Nama pengguna"
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
              Daftar Sekarang
            </Button>
            <FieldDescription className="text-center">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold no-underline!"
              >
                Masuk
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
