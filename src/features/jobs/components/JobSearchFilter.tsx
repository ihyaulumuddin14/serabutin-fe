import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useIsMobile } from "@/shared/hooks/useAnimation";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const JobSearchFilter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [search, setSearch] = useState(q || "");
  const isMobile = useIsMobile();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) {
      params.set("q", search);
    }
    navigate({
      pathname: "/jobs",
      search: params.toString(),
    });
  };

  return (
    <form
      className="w-full flex items-center relative"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <Input
        className="w-full bg-card p-6 pr-15 sm:pr-27"
        placeholder="Cari kebutuhan berdasarkan judul, lokasi, deskripsi"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        type="submit"
        className="absolute right-2 rounded-full aspect-square md:rounded-md md:aspect-auto"
      >
        {isMobile ? <Search /> : "Temukan"}
      </Button>
    </form>
  );
};

export default JobSearchFilter;
