"use client"

import { useAuth } from "./hooks/use-auth"
import { LoginForm } from "./components/login-form"
import { Dashboard } from "./components/dashboard"
import { ToastProvider } from "./components/toast-provider"

export default function App() {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      {!isAuthenticated || !user ? <LoginForm onLogin={login} /> : <Dashboard user={user} onLogout={logout} />}
    </ToastProvider>
  )
}
