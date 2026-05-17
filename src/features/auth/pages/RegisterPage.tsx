import { AuthCard } from "../components/AuthCard";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Registrasi"
      description="Buat akun baru dan mulai sekarang"
    >
      <RegisterForm />
    </AuthCard>
  )
}