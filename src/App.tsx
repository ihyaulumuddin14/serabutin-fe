import { QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import InitAuth from "./features/auth/components/InitAuth"
import ProtectedRoute from "./features/auth/components/ProtectedRoute"
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import VerifyPage from "./features/auth/pages/VerifyPage"
import { Toaster } from './shared/components/ui/sonner'
import AuthLayout from './shared/layouts/AuthLayout'
import JobsLayout from "./shared/layouts/JobsLayout"
import { queryClient } from "./shared/lib/queryClient"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route element={<InitAuth />}>
            <Route path='/' element={<Navigate to="/jobs" replace/>}/>

            <Route element={<AuthLayout />}>
              <Route path='verify' element={<VerifyPage />}/>
              <Route path='register' element={<RegisterPage />}/>
              <Route path='login' element={<LoginPage />}/>
            </Route>

            <Route path='/jobs' element={<JobsLayout />}>
              <Route index element={<h1>Jobs Page</h1>} />
            </Route>

            <Route path='/profile' element={<ProtectedRoute />}>
              <Route index element={<h1>Profile Page</h1>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
