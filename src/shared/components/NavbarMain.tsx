import { useMe } from "@/features/user/hooks/userHooks";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import Skeleton from "./Skeleton";

const NavbarMain = () => {
  const { user, isPending } = useMe();
  const navigate = useNavigate();

  return (
    <nav className="absolute z-50 top-0 left-0 w-full h-14.5 px-4 sm:px-8 flex items-center justify-between bg-white">
      {/* logo */}
      <Link to="/" className="flex gap-3 items-center">
        <img src="/logo.webp" alt="logo" />
        <h1 className="text-xl sm:text-[26px] tracking-[3.64px] font-inter font-bold">SERABUTIN</h1>
      </Link>

      {/* profile or auth button */}

      {isPending ? <Skeleton /> : user ? (
        <div className="flex gap-2">
          <p>{user.fullName}</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={() => navigate("/register")}>Registrasi</Button>
          <Button variant={"secondary"} onClick={() => navigate("/login")}>Masuk</Button>
        </div>
      )}
    </nav>
  );
};

export default NavbarMain;
