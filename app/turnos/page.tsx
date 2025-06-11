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
  Calendar,
  Clock,
  Plus,
  Search,
  User,
  Stethoscope,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { TurnoForm } from "@/components/forms/TurnoForm"

interface Turno {
  id: number
  paciente_nombre: string
  paciente_apellido: string
  paciente_dni: string
  medico_nombre: string
  medico_apellido: string
  medico_especialidad: string
  consultorio_numero: string
  consultorio_nombre: string
  fecha_hora: string
  duracion_minutos: number
  estado: "programado" | "atendido" | "cancelado" | "ausente"
  modalidad_pago: "obra_social" | "particular"
  monto?: number
}

export default function TurnosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    loadTurnos()
  }, [user, router, selectedDate])

  const loadTurnos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/turnos?fecha=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        setTurnos(data)
      }
    } catch (error) {
      console.error("Error loading turnos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTurnos = turnos.filter(
    (turno) =>
      turno.paciente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turno.paciente_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turno.paciente_dni.includes(searchTerm) ||
      turno.medico_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turno.medico_apellido.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getEstadoBadge = (estado: string) => {
    const variants = {
      programado: { variant: "default" as const, icon: Clock, color: "bg-blue-100 text-blue-800" },
      atendido: { variant: "default" as const, icon: CheckCircle, color: "bg-green-100 text-green-800" },
      cancelado: { variant: "destructive" as const, icon: XCircle, color: "bg-red-100 text-red-800" },
      ausente: { variant: "outline" as const, icon: AlertCircle, color: "bg-yellow-100 text-yellow-800" },
    }
    return variants[estado as keyof typeof variants] || variants.programado
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Turnos</h1>
                <p className="text-gray-600">Administra los turnos médicos</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Turno
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fecha</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por paciente, médico o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredTurnos.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Programados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredTurnos.filter((t) => t.estado === "programado").length}
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
                  <p className="text-sm font-medium text-gray-600">Atendidos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredTurnos.filter((t) => t.estado === "atendido").length}
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
                    {filteredTurnos.filter((t) => t.estado === "cancelado").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Turnos List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando turnos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTurnos.length > 0 ? (
              filteredTurnos.map((turno) => {
                const estadoBadge = getEstadoBadge(turno.estado)
                const IconComponent = estadoBadge.icon

                return (
                  <Card key={turno.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Horario */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{formatTime(turno.fecha_hora)}</p>
                              <p className="text-sm text-gray-600">{turno.duracion_minutos} min</p>
                            </div>
                          </div>

                          {/* Paciente */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <User className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {turno.paciente_nombre} {turno.paciente_apellido}
                              </p>
                              <p className="text-sm text-gray-600">DNI: {turno.paciente_dni}</p>
                            </div>
                          </div>

                          {/* Médico */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Stethoscope className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                Dr. {turno.medico_nombre} {turno.medico_apellido}
                              </p>
                              <p className="text-sm text-gray-600">{turno.medico_especialidad}</p>
                            </div>
                          </div>

                          {/* Consultorio */}
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <MapPin className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{turno.consultorio_numero}</p>
                              <p className="text-sm text-gray-600">{turno.consultorio_nombre}</p>
                            </div>
                          </div>
                        </div>

                        {/* Estado y Acciones */}
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <Badge className={estadoBadge.color}>
                              <IconComponent className="h-3 w-3 mr-1" />
                              {turno.estado}
                            </Badge>
                            {turno.monto && (
                              <p className="text-sm text-gray-600 mt-1 flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />${turno.monto}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay turnos para esta fecha</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "No se encontraron turnos con esos criterios"
                      : `No hay turnos programados para ${formatDate(selectedDate)}`}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Programar Turno
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        {/* Modal de formulario de turno */}
        {showForm && (
          <TurnoForm
            onClose={() => setShowForm(false)}
            onSave={(newTurno) => {
              // Actualizar la lista de turnos
              setTurnos((prev) => [...prev, newTurno])
              loadTurnos() // Recargar la lista
            }}
          />
        )}
      </div>
    </div>
  )
}
