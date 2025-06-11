"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-simple"
import { Badge } from "@/components/ui/badge-simple"
import { Navigation } from "@/components/ui/navigation"
import { User, Users, UserCheck } from "lucide-react"

export default function UsuariosPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.rol !== "administrador") {
      router.push("/dashboard")
      return
    }
  }, [user, router])

  if (!user || user.rol !== "administrador") return null

  const usuarios = [
    { id: 1, username: "admin", nombre: "Juan", apellido: "Administrador", rol: "administrador", activo: true },
    { id: 2, username: "recep1", nombre: "María", apellido: "González", rol: "recepcionista", activo: true },
    { id: 3, username: "dr.smith", nombre: "Carlos", apellido: "Smith", rol: "medico", activo: true },
    { id: 4, username: "tec1", nombre: "Luis", apellido: "Técnico", rol: "tecnico", activo: true },
  ]

  const getRoleBadgeColor = (rol: string) => {
    const colors = {
      administrador: "bg-purple-100 text-purple-800",
      recepcionista: "bg-green-100 text-green-800",
      medico: "bg-blue-100 text-blue-800",
      tecnico: "bg-orange-100 text-orange-800",
    }
    return colors[rol as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600">Administra usuarios del sistema</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <Card key={usuario.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span>{usuario.username}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Activo</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {usuario.nombre} {usuario.apellido}
                </h3>
                <Badge className={getRoleBadgeColor(usuario.rol)}>{usuario.rol}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
