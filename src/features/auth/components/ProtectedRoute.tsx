import { useCallbackUrl } from "@/shared/hooks/useCallbackUrl"
import { Navigate, Outlet } from "react-router"
import { useShallow } from "zustand/react/shallow"
import { useAuthStore } from "../stores/authStores"
import { Icon } from "@iconify/react";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const callbackUrl = useCallbackUrl()
  const { isAuthenticated, isHydrated } = useAuthStore(useShallow(state => ({
    isAuthenticated: state.isAuthenticated,
    isHydrated: state.isHydrated
  })))

  if (!isHydrated) {
    return (
      <section className="w-full min-h-screen bg-background flex justify-center items-center">
        <Icon
          icon="eos-icons:loading"
          width="2em"
          height="2em"
          className="animate-spin"
          style={{ color: "var(--foreground)" }}
        />
      </section>
    )
  }

  if (!isAuthenticated) {
    toast.error("Anda harus masuk untuk mengakses halaman ini.")
    return <Navigate replace to={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} />
  }

  return <Outlet />
}

export default ProtectedRoute