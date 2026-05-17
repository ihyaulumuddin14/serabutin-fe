import axios from "axios"
import { refreshAccessToken } from "../helper/authRefresh"
import { useAuthStore } from "@/features/auth/stores/authStores"

export const privateApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if ((error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newAccessToken = await refreshAccessToken()
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`

        return privateApi(originalRequest)
      } catch (error) {
        // just reset auth store client, prevent infinite loop if refresh token also invalid/expired
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default privateApi