"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card-simple"
import { Button } from "@/components/ui/button-simple"
import { Input } from "@/components/ui/input-simple"
import { Label } from "@/components/ui/label-simple"
import { Badge } from "@/components/ui/badge-simple"
import { Navigation } from "@/components/ui/navigation"
import { Users, Search, Plus, Edit, Eye, Phone, Mail, Calendar, CreditCard } from "lucide-react"

interface Paciente {
  id: number
  dni: string
  nombre: string
  apellido: string
  fecha_nacimiento?: string
  telefono?: string
  email?: string
  direccion?: string
  obra_social?: string
  numero_afiliado?: string
  created_at: string
}

export default function PacientesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    loadPacientes()
  }, [user, router])

  const loadPacientes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/pacientes")
      if (response.ok) {
        const data = await response.json()
        setPacientes(data)
      }
    } catch (error) {
      console.error("Error loading pacientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.dni.includes(searchTerm) ||
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificada"
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "N/A"
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return `${age} años`
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
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
                <p className="text-gray-600">Administra la información de los pacientes</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Paciente
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por DNI, nombre o apellido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {filteredPacientes.length} pacientes
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pacientes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando pacientes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacientes.map((paciente) => (
              <Card key={paciente.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {paciente.nombre} {paciente.apellido}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <CreditCard className="h-4 w-4 mr-1" />
                        DNI: {paciente.dni}
                      </CardDescription>
                    </div>
                    <Badge variant={paciente.obra_social === "Particular" ? "outline" : "default"} className="ml-2">
                      {paciente.obra_social || "Sin OS"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{calculateAge(paciente.fecha_nacimiento)}</span>
                    </div>
                    {paciente.telefono && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{paciente.telefono}</span>
                      </div>
                    )}
                    {paciente.email && (
                      <div className="flex items-center text-gray-600 col-span-2">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{paciente.email}</span>
                      </div>
                    )}
                  </div>

                  {paciente.numero_afiliado && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Afiliado: {paciente.numero_afiliado}</p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPaciente(paciente)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPaciente(paciente)
                        setShowForm(true)
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPacientes.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando un nuevo paciente"}
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Paciente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de detalle del paciente */}
      {selectedPaciente && !showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {selectedPaciente.nombre} {selectedPaciente.apellido}
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedPaciente(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">DNI</Label>
                  <p className="text-gray-900">{selectedPaciente.dni}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</Label>
                  <p className="text-gray-900">{formatDate(selectedPaciente.fecha_nacimiento)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                  <p className="text-gray-900">{selectedPaciente.telefono || "No especificado"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-gray-900">{selectedPaciente.email || "No especificado"}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                  <p className="text-gray-900">{selectedPaciente.direccion || "No especificada"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Obra Social</Label>
                  <p className="text-gray-900">{selectedPaciente.obra_social || "Particular"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Número de Afiliado</Label>
                  <p className="text-gray-900">{selectedPaciente.numero_afiliado || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
