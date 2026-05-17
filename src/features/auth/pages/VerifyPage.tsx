import { Button } from "@/shared/components/ui/button";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useVerifyUser } from "../hooks/authHooks";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    mutate: verifyUser,
    isPending,
    isSuccess,
    isError,
  } = useVerifyUser();

  useEffect(() => {
    if (token) {
      verifyUser(token);
    }
  }, [token, verifyUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <main>
        {isPending && (
          <div className="flex flex-col items-center gap-5">
            <Icon
              icon="eos-icons:loading"
              width="2em"
              height="2em"
              className="animate-spin"
              style={{ color: "#7A6A5A" }}
            />
            <p>Memverifikasi email Anda...</p>
          </div>
        )}
        {isSuccess && (
          <div className="flex flex-col items-center gap-5">
            <Icon
              icon="icon-park-solid:success"
              width="10em"
              height="10em"
              style={{ color: "#2E98A2" }}
            />
            <p>Email berhasil diverifikasi.</p>
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center gap-5">
            <Icon
              icon="material-symbols:sms-failed-rounded"
              width="10em"
              height="10em"
              style={{ color: "#e7000b" }}
            />
            <p>Gagal memverifikasi email</p>
            <Button
              size={"lg"}
              onClick={() => navigate(0)}
            >
              Coba lagi
            </Button>
          </div>
        )}
        {!token && (
          <div className="flex flex-col items-center gap-5">
            <Icon
              icon="material-symbols:sms-failed-rounded"
              width="10em"
              height="10em"
              style={{ color: "#e7000b" }}
            />
            <p>Token verifikasi tidak ditemukan.</p>
            <Button
              size={"lg"}
              onClick={() => navigate("/register")}
            >
              Kembali ke halaman daftar
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
