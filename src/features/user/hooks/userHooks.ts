import { useQuery } from "@tanstack/react-query"
import { getMe } from "../services/userServices"
import type { Profile, User } from "@/shared/types/entity.type"

export const useMe = () => {
  const { data, isPending, isError, error, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })

  return {
    user: data?.user as User | null,
    profile: data?.profile as Profile | null,
    isPending,
    isError,
    error,
    isLoading
  }
}