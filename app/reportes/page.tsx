"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-simple"
import { Navigation } from "@/components/ui/navigation"
import { ClipboardList, BarChart3, PieChart, TrendingUp } from "lucide-react"

export default function ReportesPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-100 rounded-xl">
              <ClipboardList className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
              <p className="text-gray-600">Genera reportes y visualiza estadísticas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                <span>Turnos por Mes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Estadísticas de turnos mensuales</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-teal-600" />
                <span>Estudios por Tipo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Distribución de estudios clínicos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <span>Ingresos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Análisis de ingresos y facturación</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
