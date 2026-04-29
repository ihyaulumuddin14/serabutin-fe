import { useLocation } from "react-router"

export const useCallbackUrl = () => {
  const location = useLocation()

  return (
    location.pathname +
    location.search +
    location.hash
  )
}