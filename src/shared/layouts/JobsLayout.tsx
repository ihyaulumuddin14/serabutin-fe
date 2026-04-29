import { Outlet } from 'react-router'
import NavbarMain from '../components/NavbarMain'

const JobsLayout = () => {
  return (
    <div className="w-full min-dvh">
      <NavbarMain />

      <main className="w-full h-[calc(100dvh-58px)] flex justify-center items-center bg-[#F6F3EF] mt-14.5">
        <Outlet />
      </main>
    </div>
  )
}

export default JobsLayout