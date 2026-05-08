import Container from "../components/Container"
import { Outlet } from "react-router"
import NavbarBack from "../components/NavbarBack"

const ProfileLayout = () => {
  return (
    <div className="w-full min-dvh">
      <header>
        <NavbarBack />
      </header>

      <main className="w-full h-[calc(100dvh-58px)] flex justify-center bg-[#F6F3EF] mt-14.5">
        <Container>
          <div className="w-full grid grid-cols-1 md:grid-cols-[minmax(0,300px)_1fr] gap-4 sm:gap-6">
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  )
}

export default ProfileLayout