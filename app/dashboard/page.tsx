"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  FileText,
  Activity,
  User,
  LogOut,
  Stethoscope,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"
import { ClinicaLogo } from "@/components/ui/logo"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    turnosHoy: 0,
    pacientesTotal: 0,
    estudiosHoy: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    loadStats()
  }, [user, router])

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]

      const turnosResponse = await fetch(`/api/turnos?fecha=${today}`)
      const turnos = await turnosResponse.json()

      const pacientesResponse = await fetch("/api/pacientes")
      const pacientes = await pacientesResponse.json()

      setStats({
        turnosHoy: turnos.length || 0,
        pacientesTotal: pacientes.length || 0,
        estudiosHoy: 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

  const menuItems = [
    {
      title: "Gestión de Turnos",
      description: "Asignar, modificar y controlar turnos médicos",
      icon: Calendar,
      href: "/turnos",
      roles: ["recepcionista", "administrador", "medico"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Pacientes",
      description: "Registrar y gestionar información de pacientes",
      icon: Users,
      href: "/pacientes",
      roles: ["recepcionista", "administrador", "medico"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Estudios Clínicos",
      description: "Gestionar órdenes y resultados de estudios",
      icon: FileText,
      href: "/estudios",
      roles: ["recepcionista", "administrador", "medico", "tecnico"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Consultorios",
      description: "Administrar consultorios y disponibilidad",
      icon: Stethoscope,
      href: "/consultorios",
      roles: ["administrador"],
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Liquidaciones",
      description: "Calcular y gestionar honorarios médicos",
      icon: Activity,
      href: "/liquidaciones",
      roles: ["administrador"],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Usuarios",
      description: "Gestionar usuarios del sistema",
      icon: User,
      href: "/usuarios",
      roles: ["administrador"],
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Reportes",
      description: "Generar reportes y estadísticas",
      icon: ClipboardList,
      href: "/reportes",
      roles: ["administrador"],
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ]

  const availableMenuItems = menuItems.filter((item) => item.roles.includes(user.rol))

  const getRoleBadgeColor = (rol: string) => {
    const colors = {
      administrador: "bg-purple-100 text-purple-800 border-purple-200",
      recepcionista: "bg-green-100 text-green-800 border-green-200",
      medico: "bg-blue-100 text-blue-800 border-blue-200",
      tecnico: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[rol as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const currentTime = new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const currentDate = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <ClinicaLogo size="md" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Clínica San Martín
                </h1>
                <p className="text-sm text-gray-600">Sistema de Gestión Médica</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:block text-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime}</span>
                </div>
                <p className="text-xs text-gray-500 capitalize">{currentDate}</p>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user.nombre} {user.apellido}
                  </p>
                  <Badge className={getRoleBadgeColor(user.rol)}>{user.rol}</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, {user.nombre}!</h2>
          <p className="text-gray-600">
            Aquí tienes un resumen de la actividad del día y acceso rápido a todas las funciones del sistema.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Turnos Hoy</CardTitle>
              <Calendar className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.turnosHoy}</div>
              <p className="text-xs opacity-80 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Turnos programados para hoy
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Pacientes</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pacientesTotal}</div>
              <p className="text-xs opacity-80 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Pacientes registrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Estudios Hoy</CardTitle>
              <Activity className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.estudiosHoy}</div>
              <p className="text-xs opacity-80 flex items-center mt-1">
                <FileText className="h-3 w-3 mr-1" />
                Estudios programados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableMenuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-0 shadow-md hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 group-hover:text-gray-700">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">© 2024 Clínica San Martín - Sistema de Gestión Médica v1.0</p>
        </div>
      </div>
    </div>
  )
}
