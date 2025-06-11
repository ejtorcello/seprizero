// Modelo simplificado de turnos para demo
export interface Turno {
  id?: number
  paciente_id: number
  medico_id: number
  consultorio_id: number
  fecha_hora: string
  duracion_minutos?: number
  estado?: "programado" | "atendido" | "cancelado" | "ausente"
  modalidad_pago?: "obra_social" | "particular"
  monto?: number
  diagnostico?: string
  observaciones?: string
  created_at?: string
}

export interface TurnoDetallado extends Turno {
  paciente_nombre: string
  paciente_apellido: string
  paciente_dni: string
  medico_nombre: string
  medico_apellido: string
  medico_especialidad: string
  consultorio_numero: string
  consultorio_nombre: string
}

// Datos de ejemplo en memoria
const turnos: TurnoDetallado[] = [
  {
    id: 1,
    paciente_id: 1,
    medico_id: 1,
    consultorio_id: 1,
    fecha_hora: new Date().toISOString(),
    duracion_minutos: 30,
    estado: "programado",
    modalidad_pago: "obra_social",
    monto: 5000,
    paciente_nombre: "Pedro",
    paciente_apellido: "Martínez",
    paciente_dni: "12345678",
    medico_nombre: "Carlos",
    medico_apellido: "Smith",
    medico_especialidad: "Medicina General",
    consultorio_numero: "101",
    consultorio_nombre: "Consultorio Medicina General",
    created_at: new Date().toISOString(),
  },
]

export class TurnoModel {
  static findAll(): TurnoDetallado[] {
    return turnos
  }

  static findByDate(fecha: string): TurnoDetallado[] {
    return turnos.filter((turno) => turno.fecha_hora.startsWith(fecha))
  }

  static create(turno: Omit<Turno, "id" | "created_at">): Turno {
    const newTurno: Turno = {
      ...turno,
      id: Math.max(...turnos.map((t) => t.id || 0), 0) + 1,
      created_at: new Date().toISOString(),
    }
    // En una implementación real, aquí se haría el join con pacientes, médicos, etc.
    return newTurno
  }

  static findById(id: number): TurnoDetallado | undefined {
    return turnos.find((turno) => turno.id === id)
  }
}
