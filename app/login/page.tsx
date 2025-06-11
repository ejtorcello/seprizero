"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
// Cambiar las importaciones de componentes UI por las versiones simplificadas
import { Button } from "@/components/ui/button-simple"
import { Input } from "@/components/ui/input-simple"
import { Label } from "@/components/ui/label-simple"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card-simple"
import { Alert, AlertDescription } from "@/components/ui/alert-simple"
import { ClinicaLogoText } from "@/components/ui/logo"
import { Eye, EyeOff, Lock, User } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await login(username, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas")
    }

    setLoading(false)
  }

  const testUsers = [
    { user: "admin", pass: "admin123", role: "Administrador", color: "text-purple-600" },
    { user: "recep1", pass: "recep123", role: "Recepcionista", color: "text-green-600" },
    { user: "dr.smith", pass: "doc123", role: "Médico", color: "text-blue-600" },
    { user: "tec1", pass: "tec123", role: "Técnico", color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:block text-center">
          <ClinicaLogoText className="justify-center mb-8" />
          <div className="space-y-4 text-gray-600">
            <h2 className="text-3xl font-bold text-gray-800">Sistema de Gestión Médica</h2>
            <p className="text-lg">
              Plataforma integral para la administración de consultorios externos y estudios clínicos
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-800">Consultorios</h3>
                <p className="text-sm text-gray-600">Gestión de turnos y atención médica</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-800">Estudios</h3>
                <p className="text-sm text-gray-600">Control de estudios clínicos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="md:hidden mb-4">
              <ClinicaLogoText className="justify-center" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-600">Accede al sistema de gestión clínica</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su usuario"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            {/* Test users */}
            <div className="border-t pt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Usuarios de Prueba</p>
              <div className="grid grid-cols-1 gap-2">
                {testUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setUsername(user.user)
                      setPassword(user.pass)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.color.replace("text-", "bg-")}`}></div>
                      <span className="text-sm font-medium text-gray-700">{user.user}</span>
                    </div>
                    <span className={`text-xs font-medium ${user.color}`}>{user.role}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Haz clic en cualquier usuario para autocompletar</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
