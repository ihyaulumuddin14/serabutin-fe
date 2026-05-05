import type { Category } from "@/shared/types/entity.type";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useCategory = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);

      if (response.data.status !== "success")
        throw new Error(response.data?.message || "Gagal mengambil data kategori");
    
      return response.data.data as Category[];
    }
  })
}