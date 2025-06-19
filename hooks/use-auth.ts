"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializar base de datos
        await fetch("/api/init", { method: "POST" })

        // Verificar si hay un usuario guardado en localStorage
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Error inicializando aplicación:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        return { success: true }
      } else {
        return { success: false, error: data.error || "Error al iniciar sesión" }
      }
    } catch (error) {
      console.error("Error en login:", error)
      return { success: false, error: "Error de conexión" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Error en logout:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
    }
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
