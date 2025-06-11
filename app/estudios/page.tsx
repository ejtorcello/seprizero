"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card-simple"
import { Button } from "@/components/ui/button-simple"
import { Input } from "@/components/ui/input-simple"
import { Badge } from "@/components/ui/badge-simple"
import { Navigation } from "@/components/ui/navigation"
import {
  FileText,
  Search,
  Plus,
  Activity,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Microscope,
} from "lucide-react"

interface Estudio {
  id: number
  paciente_nombre: string
  paciente_apellido: string
  paciente_dni: string
  tipo_estudio: string
  fecha_orden: string
  fecha_programada?: string
  estado: "pendiente" | "programado" | "realizado" | "cancelado"
  medico_solicitante: string
  origen: "ambulatorio" | "guardia" | "internacion"
  observaciones?: string
}

export default function EstudiosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [estudios, setEstudios] = useState<Estudio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    loadEstudios()
  }, [user, router])

  const loadEstudios = async () => {
    try {
      setLoading(true)
      // Datos de ejemplo para estudios
      const estudiosEjemplo: Estudio[] = [
        {
          id: 1,
          paciente_nombre: "Pedro",
          paciente_apellido: "Martínez",
          paciente_dni: "12345678",
          tipo_estudio: "Radiografía de Tórax",
          fecha_orden: new Date().toISOString(),
          fecha_programada: new Date(Date.now() + 86400000).toISOString(),
          estado: "programado",
          medico_solicitante: "Dr. Carlos Smith",
          origen: "ambulatorio",
          observaciones: "Control post-operatorio",
        },
        {
          id: 2,
          paciente_nombre: "Laura",
          paciente_apellido: "Fernández",
          paciente_dni: "87654321",
          tipo_estudio: "Análisis de Sangre Completo",
          fecha_orden: new Date(Date.now() - 86400000).toISOString(),
          estado: "pendiente",
          medico_solicitante: "Dr. Ana García",
          origen: "guardia",
          observaciones: "Urgente - Sospecha de anemia",
        },
        {
          id: 3,
          paciente_nombre: "Roberto",
          paciente_apellido: "López",
          paciente_dni: "11111111",
          tipo_estudio: "Ecografía Abdominal",
          fecha_orden: new Date(Date.now() - 172800000).toISOString(),
          fecha_programada: new Date(Date.now() - 86400000).toISOString(),
          estado: "realizado",
          medico_solicitante: "Dr. Carlos Smith",
          origen: "ambulatorio",
        },
      ]
      setEstudios(estudiosEjemplo)
    } catch (error) {
      console.error("Error loading estudios:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEstudios = estudios.filter((estudio) => {
    const matchesSearch =
      estudio.paciente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudio.paciente_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudio.paciente_dni.includes(searchTerm) ||
      estudio.tipo_estudio.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterEstado === "todos" || estudio.estado === filterEstado

    return matchesSearch && matchesFilter
  })

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      programado: { color: "bg-blue-100 text-blue-800", icon: Clock },
      realizado: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelado: { color: "bg-red-100 text-red-800", icon: XCircle },
    }
    return variants[estado as keyof typeof variants] || variants.pendiente
  }

  const getOrigenBadge = (origen: string) => {
    const variants = {
      ambulatorio: { color: "bg-blue-100 text-blue-800", label: "Ambulatorio" },
      guardia: { color: "bg-red-100 text-red-800", label: "Guardia" },
      internacion: { color: "bg-purple-100 text-purple-800", label: "Internación" },
    }
    return variants[origen as keyof typeof variants] || variants.ambulatorio
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Estudios Clínicos</h1>
                <p className="text-gray-600">Gestiona órdenes médicas y estudios diagnósticos</p>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por paciente, DNI o estudio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="programado">Programado</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Estudios</p>
                  <p className="text-2xl font-bold text-purple-600">{filteredEstudios.length}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {estudios.filter((e) => e.estado === "pendiente").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Programados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {estudios.filter((e) => e.estado === "programado").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Realizados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {estudios.filter((e) => e.estado === "realizado").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelados</p>
                  <p className="text-2xl font-bold text-red-600">
                    {estudios.filter((e) => e.estado === "cancelado").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estudios List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando estudios...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEstudios.length > 0 ? (
              filteredEstudios.map((estudio) => {
                const estadoBadge = getEstadoBadge(estudio.estado)
                const origenBadge = getOrigenBadge(estudio.origen)
                const EstadoIcon = estadoBadge.icon

                return (
                  <Card key={estudio.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Microscope className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">{estudio.tipo_estudio}</h3>
                                <p className="text-sm text-gray-600">Orden #{estudio.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={estadoBadge.color}>
                                <EstadoIcon className="h-3 w-3 mr-1" />
                                {estudio.estado}
                              </Badge>
                              <Badge className={origenBadge.color}>{origenBadge.label}</Badge>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {estudio.paciente_nombre} {estudio.paciente_apellido}
                                </p>
                                <p className="text-sm text-gray-600">DNI: {estudio.paciente_dni}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">Orden: {formatDate(estudio.fecha_orden)}</p>
                                {estudio.fecha_programada && (
                                  <p className="text-sm text-gray-600">
                                    Programado: {formatDateTime(estudio.fecha_programada)}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{estudio.medico_solicitante}</p>
                                <p className="text-sm text-gray-600">Médico solicitante</p>
                              </div>
                            </div>
                          </div>

                          {/* Observaciones */}
                          {estudio.observaciones && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700">
                                <strong>Observaciones:</strong> {estudio.observaciones}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button variant="outline" size="sm">
                            Ver Detalle
                          </Button>
                          {estudio.estado === "pendiente" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Programar
                            </Button>
                          )}
                          {estudio.estado === "programado" && user.rol === "tecnico" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Realizar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron estudios</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "No hay estudios que coincidan con tu búsqueda"
                      : "No hay estudios registrados en el sistema"}
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Orden
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
