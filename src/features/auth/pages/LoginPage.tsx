import { AuthCard } from "../components/AuthCard";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard
      title="Masuk"
      description="Masuk ke akun anda"
    >
      <LoginForm />
    </AuthCard>
  );
}