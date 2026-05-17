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
import ProfilePage from "./features/user/pages/ProfilePage"
import ProfileLayout from "./shared/layouts/ProfileLayout"
import JobPage from "./features/jobs/pages/JobPage"
import ClientJobBidPage from "./features/user/pages/ClientJobBidPage"
import ClientJobBidLayout from "./shared/layouts/ClientJobBidLayout"
import ClientBidPage from "./features/user/pages/ClientBidPage"
import ClientPostJobPage from "./features/jobs/pages/ClientPostJobPage"
import { TooltipProvider } from "./shared/components/ui/tooltip"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route element={<InitAuth />}>
              <Route path='/' element={<Navigate to="/jobs" replace/>}/>

              <Route element={<AuthLayout />}>
                <Route path='verify-email' element={<VerifyPage />}/>
                <Route path='register' element={<RegisterPage />}/>
                <Route path='login' element={<LoginPage />}/>
              </Route>

              <Route path='/jobs' element={<JobsLayout />}>
                <Route index element={<JobPage />} />
              </Route>

              <Route path="/profile" element={<ProfileLayout />}>
                <Route path=":userId" element={<ProfilePage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfileLayout />}>
                  <Route index element={<ProfilePage />} />
                </Route>
                <Route element={<ClientJobBidLayout />}>
                  <Route path="/job-bids" element={<ClientJobBidPage />} />
                  <Route path="/job-bids/:jobId" element={<ClientBidPage />} />
                  <Route path="/job-post" element={<ClientPostJobPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
