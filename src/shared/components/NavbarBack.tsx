import { Link, useNavigate } from "react-router"
import { Button } from "./ui/button"

const NavbarBack = () => {
  const navigate = useNavigate()

  const handleBack = () => navigate(-1)

  return ( 
    <nav className="fixed z-50 top-0 left-0 w-full h-14.5 px-4 sm:px-8 flex items-center justify-between bg-white">
      {/* logo */}
      <Link to="/" className="flex gap-3 items-center">
        <img src="/logo.webp" alt="logo" />
        <h1 className="text-xl sm:text-[26px] font-inter font-bold">Serabutin</h1>
      </Link>

      {/* back button */}
      <Button variant={"outline"} onClick={handleBack}>Kembali</Button>
    </nav>
  )
}

export default NavbarBack