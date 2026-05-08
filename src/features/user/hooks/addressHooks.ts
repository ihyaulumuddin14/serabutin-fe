import { useQuery } from "@tanstack/react-query";

type ItemPlace = {
  kode: string;
  nama: string;
}

export const useRegencies = () => {
  return useQuery({
    queryKey: ["regencies", "35"],
    queryFn: async () => {
      const res = await fetch(
        "https://api-wilayah.alvirateam.com/api/v1/regencies?province_id=35"
      );
      const data = await res.json() as {
        endpoint: string;
        provinceId: string;
        data: ItemPlace[]
      };

      const allowed = ["35.07", "35.79", "35.73"];
      return data.data.filter((item) => allowed.includes(item.kode));
    },
  });
}

export const useDistricts = (regencyId: string) => {
  return useQuery({
    queryKey: ["districts", regencyId],
    queryFn: async () => {
      const res = await fetch(
        `https://api-wilayah.alvirateam.com/api/v1/districts?regency_id=${regencyId}`
      );
      const data = await res.json() as {
        endpoint: string;
        regencyId: string;
        data: ItemPlace[]
      };
      return data.data;
    },
    enabled: !!regencyId
  })
}