"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button-simple"
import { Input } from "@/components/ui/input-simple"
import { Label } from "@/components/ui/label-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-simple"
import { Alert, AlertDescription } from "@/components/ui/alert-simple"
import { X, Save, FileText, Search, Plus, Trash2 } from "lucide-react"

interface EstudioFormProps {
  onClose: () => void
  onSave: (estudio: any) => void
  estudio?: any
}

export function EstudioForm({ onClose, onSave, estudio }: EstudioFormProps) {
  const [formData, setFormData] = useState({
    paciente_id: estudio?.paciente_id || "",
    medico_id: estudio?.medico_id || "",
    origen: estudio?.origen || "ambulatorio",
    observaciones: estudio?.observaciones || "",
    estudios_solicitados: estudio?.estudios_solicitados || [{ tipo_estudio_id: "", observaciones: "" }],
  })

  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [tiposEstudios, setTiposEstudios] = useState([])
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

      // Datos mock para médicos
      setMedicos([
        { id: 1, nombre: "Carlos", apellido: "Smith", especialidad: "Medicina General" },
        { id: 2, nombre: "Ana", apellido: "García", especialidad: "Cardiología" },
      ])

      // Datos mock para tipos de estudios
      setTiposEstudios([
        { id: 1, nombre: "Radiografía de Tórax", costo: 3000, duracion_minutos: 15 },
        { id: 2, nombre: "Tomografía Computada", costo: 12000, duracion_minutos: 30 },
        { id: 3, nombre: "Resonancia Magnética", costo: 15000, duracion_minutos: 45 },
        { id: 4, nombre: "Ecografía Abdominal", costo: 4000, duracion_minutos: 20 },
        { id: 5, nombre: "Análisis de Sangre Completo", costo: 2500, duracion_minutos: 10 },
        { id: 6, nombre: "Electrocardiograma", costo: 2000, duracion_minutos: 15 },
        { id: 7, nombre: "Mamografía", costo: 4500, duracion_minutos: 20 },
        { id: 8, nombre: "Endoscopía Digestiva", costo: 8000, duracion_minutos: 30 },
        { id: 9, nombre: "Colonoscopía", costo: 10000, duracion_minutos: 60 },
        { id: 10, nombre: "Densitometría Ósea", costo: 5000, duracion_minutos: 25 },
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

  const handleEstudioChange = (index: number, field: string, value: string) => {
    const newEstudios = [...formData.estudios_solicitados]
    newEstudios[index] = {
      ...newEstudios[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      estudios_solicitados: newEstudios,
    }))
  }

  const addEstudio = () => {
    setFormData((prev) => ({
      ...prev,
      estudios_solicitados: [...prev.estudios_solicitados, { tipo_estudio_id: "", observaciones: "" }],
    }))
  }

  const removeEstudio = (index: number) => {
    if (formData.estudios_solicitados.length > 1) {
      const newEstudios = formData.estudios_solicitados.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        estudios_solicitados: newEstudios,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validaciones básicas
      if (!formData.paciente_id || !formData.medico_id) {
        setError("Paciente y médico son campos obligatorios")
        return
      }

      if (formData.estudios_solicitados.some((est) => !est.tipo_estudio_id)) {
        setError("Todos los estudios deben tener un tipo seleccionado")
        return
      }

      const ordenData = {
        ...formData,
        fecha_orden: new Date().toISOString().split("T")[0],
      }

      // Simular llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(ordenData)
      onClose()
    } catch (err) {
      setError("Error al guardar la orden médica. Intenta nuevamente.")
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

  const getTotalCosto = () => {
    return formData.estudios_solicitados.reduce((total, estudio) => {
      const tipoEstudio = tiposEstudios.find((t: any) => t.id.toString() === estudio.tipo_estudio_id)
      return total + (tipoEstudio?.costo || 0)
    }, 0)
  }

  const getTotalDuracion = () => {
    return formData.estudios_solicitados.reduce((total, estudio) => {
      const tipoEstudio = tiposEstudios.find((t: any) => t.id.toString() === estudio.tipo_estudio_id)
      return total + (tipoEstudio?.duracion_minutos || 0)
    }, 0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>{estudio ? "Editar Orden Médica" : "Nueva Orden Médica"}</span>
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

            {/* Información General */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información General</h3>

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paciente_id">Paciente *</Label>
                  <select
                    id="paciente_id"
                    name="paciente_id"
                    value={formData.paciente_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                <div className="space-y-2">
                  <Label htmlFor="medico_id">Médico Solicitante *</Label>
                  <select
                    id="medico_id"
                    name="medico_id"
                    value={formData.medico_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <Label htmlFor="origen">Origen</Label>
                  <select
                    id="origen"
                    name="origen"
                    value={formData.origen}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={loading}
                  >
                    <option value="ambulatorio">Ambulatorio</option>
                    <option value="guardia">Guardia</option>
                    <option value="internacion">Internación</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estudios Solicitados */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Estudios Solicitados</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEstudio}
                  disabled={loading}
                  className="text-purple-600 border-purple-600 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Estudio
                </Button>
              </div>

              {formData.estudios_solicitados.map((estudio, index) => (
                <Card key={index} className="border-purple-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`tipo_estudio_${index}`}>Tipo de Estudio *</Label>
                          <select
                            id={`tipo_estudio_${index}`}
                            value={estudio.tipo_estudio_id}
                            onChange={(e) => handleEstudioChange(index, "tipo_estudio_id", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                            disabled={loading}
                          >
                            <option value="">Seleccionar estudio</option>
                            {tiposEstudios.map((tipo: any) => (
                              <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre} - ${tipo.costo} ({tipo.duracion_minutos} min)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`observaciones_estudio_${index}`}>Observaciones del Estudio</Label>
                          <Input
                            id={`observaciones_estudio_${index}`}
                            value={estudio.observaciones}
                            onChange={(e) => handleEstudioChange(index, "observaciones", e.target.value)}
                            placeholder="Observaciones específicas..."
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {formData.estudios_solicitados.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeEstudio(index)}
                          disabled={loading}
                          className="text-red-600 border-red-600 hover:bg-red-50 mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Resumen */}
              {formData.estudios_solicitados.some((est) => est.tipo_estudio_id) && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total de Estudios</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formData.estudios_solicitados.filter((est) => est.tipo_estudio_id).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Costo Total</p>
                        <p className="text-2xl font-bold text-purple-600">${getTotalCosto().toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Duración Total</p>
                        <p className="text-2xl font-bold text-purple-600">{getTotalDuracion()} min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Observaciones Generales */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones Generales</Label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Observaciones adicionales sobre la orden médica..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{estudio ? "Actualizar" : "Crear Orden"}</span>
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
