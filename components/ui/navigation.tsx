"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button-simple"
import { Badge } from "@/components/ui/badge-simple"
import { ClinicaLogo } from "@/components/ui/logo"
import {
  LogOut,
  Home,
  Calendar,
  Users,
  FileText,
  Stethoscope,
  Activity,
  User,
  ClipboardList,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["recepcionista", "administrador", "medico", "tecnico"],
    },
    {
      name: "Turnos",
      href: "/turnos",
      icon: Calendar,
      roles: ["recepcionista", "administrador", "medico"],
    },
    {
      name: "Pacientes",
      href: "/pacientes",
      icon: Users,
      roles: ["recepcionista", "administrador", "medico"],
    },
    {
      name: "Estudios",
      href: "/estudios",
      icon: FileText,
      roles: ["recepcionista", "administrador", "medico", "tecnico"],
    },
    {
      name: "Consultorios",
      href: "/consultorios",
      icon: Stethoscope,
      roles: ["administrador"],
    },
    {
      name: "Liquidaciones",
      href: "/liquidaciones",
      icon: Activity,
      roles: ["administrador"],
    },
    {
      name: "Usuarios",
      href: "/usuarios",
      icon: User,
      roles: ["administrador"],
    },
    {
      name: "Reportes",
      href: "/reportes",
      icon: ClipboardList,
      roles: ["administrador"],
    },
  ]

  const availableItems = navigationItems.filter((item) => item.roles.includes(user.rol))

  const getRoleBadgeColor = (rol: string) => {
    const colors = {
      administrador: "bg-purple-100 text-purple-800 border-purple-200",
      recepcionista: "bg-green-100 text-green-800 border-green-200",
      medico: "bg-blue-100 text-blue-800 border-blue-200",
      tecnico: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[rol as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <ClinicaLogo size="sm" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Clínica San Martín
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {availableItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.nombre} {user.apellido}
                </p>
              </div>
              <Badge className={getRoleBadgeColor(user.rol)}>{user.rol}</Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {availableItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Mobile user info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.nombre} {user.apellido}
                  </p>
                  <Badge className={getRoleBadgeColor(user.rol)}>{user.rol}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
