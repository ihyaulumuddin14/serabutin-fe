import { useMe } from "@/features/user/hooks/userHooks"
import { useEffect } from "react"
import { Outlet } from "react-router"
import { useShallow } from "zustand/react/shallow"
import { useAuthStore } from "../stores/authStores"

export default function InitAuth() {
  const { setAuth, setIsHydrated } = useAuthStore(useShallow((state) => ({
    setAuth: state.setAuth,
    setIsHydrated: state.setIsHydrated
  })))
  
  const { user, isPending, isError } = useMe()

  useEffect(() => {
    if (user) {
      setAuth(user.role, true)
    }

    if (!isPending) {
      setIsHydrated(true)
    }
  }, [ user, isPending, isError, setAuth, setIsHydrated ])

  return <Outlet />
}
