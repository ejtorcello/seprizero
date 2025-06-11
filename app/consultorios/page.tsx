"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-simple"
import { Navigation } from "@/components/ui/navigation"
import { Stethoscope, MapPin, Clock, CheckCircle } from "lucide-react"

export default function ConsultoriosPage() {
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

  const consultorios = [
    { id: 1, numero: "101", nombre: "Consultorio Medicina General", activo: true },
    { id: 2, numero: "102", nombre: "Consultorio Cardiología", activo: true },
    { id: 3, numero: "103", nombre: "Consultorio Traumatología", activo: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Stethoscope className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Consultorios</h1>
              <p className="text-gray-600">Administra consultorios y disponibilidad</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultorios.map((consultorio) => (
            <Card key={consultorio.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <span>{consultorio.numero}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Activo</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">{consultorio.nombre}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Disponible</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
