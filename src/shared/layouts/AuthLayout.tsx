import { Outlet } from "react-router"
import NavbarBack from "../components/NavbarBack"

const AuthLayout = () => {
  return (
    <div className="w-full min-dvh">
      <header>
        <NavbarBack />
      </header>

      <main className="w-full h-[calc(100dvh-58px)] flex justify-center items-center bg-[#F6F3EF] mt-14.5">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout