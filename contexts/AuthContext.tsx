"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: number
  username: string
  nombre: string
  apellido: string
  rol: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("🔍 Verificando autenticación...")

      // Primero intentar obtener de la cookie del navegador
      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1]

      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        console.log("✅ Usuario encontrado en cookie:", userData)
        setUser(userData)
      } else {
        console.log("❌ No hay usuario en cookie")
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 Intentando login con:", { username })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("📡 Respuesta del servidor:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Login exitoso:", data)
        setUser(data.user)
        return true
      } else {
        const errorData = await response.json()
        console.log("❌ Error en login:", errorData)
        return false
      }
    } catch (error) {
      console.error("❌ Error en login:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    // Limpiar cookie
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
