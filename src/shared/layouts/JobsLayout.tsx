import { Outlet } from 'react-router'
import NavbarMain from '../components/NavbarMain'
import Container from '../components/Container'

const JobsLayout = () => {
  return (
    <div className="w-full min-dvh">
      <header>
        <NavbarMain />
      </header>

      <main className="w-full h-[calc(100dvh-58px)] flex justify-center bg-[#F6F3EF] mt-14.5">
        <Container>
          <div className="w-full grid grid-cols-1 md:grid-cols-[minmax(0,300px)_1fr] gap-4 sm:gap-6 relative">
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  )
}

export default JobsLayout