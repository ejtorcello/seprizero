"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button-simple"
import { Input } from "@/components/ui/input-simple"
import { Label } from "@/components/ui/label-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-simple"
import { Alert, AlertDescription } from "@/components/ui/alert-simple"
import { X, Save, Calendar, Search } from "lucide-react"

interface TurnoFormProps {
  onClose: () => void
  onSave: (turno: any) => void
  turno?: any
}

export function TurnoForm({ onClose, onSave, turno }: TurnoFormProps) {
  const [formData, setFormData] = useState({
    paciente_id: turno?.paciente_id || "",
    medico_id: turno?.medico_id || "",
    consultorio_id: turno?.consultorio_id || "",
    fecha: turno?.fecha_hora?.split("T")[0] || "",
    hora: turno?.fecha_hora?.split("T")[1]?.substring(0, 5) || "",
    duracion_minutos: turno?.duracion_minutos || 30,
    modalidad_pago: turno?.modalidad_pago || "obra_social",
    monto: turno?.monto || "",
    observaciones: turno?.observaciones || "",
  })

  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [consultorios, setConsultorios] = useState([])
  const [searchPaciente, setSearchPaciente] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Cargar pacientes
      const pacientesResponse = await fetch("/api/pacientes")
      if (pacientesResponse.ok) {
        const pacientesData = await pacientesResponse.json()
        setPacientes(pacientesData)
      }

      // Datos mock para médicos y consultorios
      setMedicos([
        { id: 1, nombre: "Carlos", apellido: "Smith", especialidad: "Medicina General" },
        { id: 2, nombre: "Ana", apellido: "García", especialidad: "Cardiología" },
      ])

      setConsultorios([
        { id: 1, numero: "101", nombre: "Consultorio Medicina General" },
        { id: 2, numero: "102", nombre: "Consultorio Cardiología" },
        { id: 3, numero: "103", nombre: "Consultorio Traumatología" },
      ])
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validaciones básicas
      if (
        !formData.paciente_id ||
        !formData.medico_id ||
        !formData.consultorio_id ||
        !formData.fecha ||
        !formData.hora
      ) {
        setError("Todos los campos obligatorios deben ser completados")
        return
      }

      // Combinar fecha y hora
      const fecha_hora = `${formData.fecha}T${formData.hora}:00`

      const turnoData = {
        ...formData,
        fecha_hora,
        duracion_minutos: Number.parseInt(formData.duracion_minutos.toString()),
        monto: formData.monto ? Number.parseFloat(formData.monto.toString()) : null,
      }

      // Simular llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(turnoData)
      onClose()
    } catch (err) {
      setError("Error al guardar el turno. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const filteredPacientes = pacientes.filter(
    (p: any) =>
      searchPaciente === "" ||
      p.dni.includes(searchPaciente) ||
      p.nombre.toLowerCase().includes(searchPaciente.toLowerCase()) ||
      p.apellido.toLowerCase().includes(searchPaciente.toLowerCase()),
  )

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }
    return slots
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>{turno ? "Editar Turno" : "Nuevo Turno"}</span>
            </CardTitle>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Selección de Paciente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Paciente</h3>

              <div className="space-y-2">
                <Label htmlFor="search_paciente">Buscar Paciente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search_paciente"
                    value={searchPaciente}
                    onChange={(e) => setSearchPaciente(e.target.value)}
                    placeholder="Buscar por DNI, nombre o apellido..."
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paciente_id">Seleccionar Paciente *</Label>
                <select
                  id="paciente_id"
                  name="paciente_id"
                  value={formData.paciente_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Seleccionar paciente</option>
                  {filteredPacientes.map((paciente: any) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nombre} {paciente.apellido} - DNI: {paciente.dni}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Médico y Consultorio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Atención Médica</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medico_id">Médico *</Label>
                  <select
                    id="medico_id"
                    name="medico_id"
                    value={formData.medico_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Seleccionar médico</option>
                    {medicos.map((medico: any) => (
                      <option key={medico.id} value={medico.id}>
                        Dr. {medico.nombre} {medico.apellido} - {medico.especialidad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultorio_id">Consultorio *</Label>
                  <select
                    id="consultorio_id"
                    name="consultorio_id"
                    value={formData.consultorio_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Seleccionar consultorio</option>
                    {consultorios.map((consultorio: any) => (
                      <option key={consultorio.id} value={consultorio.id}>
                        {consultorio.numero} - {consultorio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Programación</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora">Hora *</Label>
                  <select
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Seleccionar hora</option>
                    {generateTimeSlots().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracion_minutos">Duración (min)</Label>
                  <select
                    id="duracion_minutos"
                    name="duracion_minutos"
                    value={formData.duracion_minutos}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Facturación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Facturación</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modalidad_pago">Modalidad de Pago</Label>
                  <select
                    id="modalidad_pago"
                    name="modalidad_pago"
                    value={formData.modalidad_pago}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="obra_social">Obra Social</option>
                    <option value="particular">Particular</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monto">Monto ($)</Label>
                  <Input
                    id="monto"
                    name="monto"
                    type="number"
                    value={formData.monto}
                    onChange={handleChange}
                    placeholder="5000"
                    disabled={loading}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Observaciones adicionales..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{turno ? "Actualizar" : "Programar"}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
