// Tipos globales para la aplicación
export interface User {
  id: number
  username: string
  nombre: string
  apellido: string
  email?: string
  rol: "recepcionista" | "medico" | "administrador" | "tecnico"
  activo: boolean
  created_at: string
}

export interface Paciente {
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

export interface Turno {
  id: number
  paciente_id: number
  medico_id: number
  consultorio_id: number
  fecha_hora: string
  duracion_minutos: number
  estado: "programado" | "atendido" | "cancelado" | "ausente"
  modalidad_pago?: "obra_social" | "particular"
  monto?: number
  diagnostico?: string
  observaciones?: string
  created_at: string
}

export interface EstudioSolicitado {
  id: number
  orden_medica_id: number
  tipo_estudio_id: number
  fecha_programada?: string
  fecha_realizada?: string
  estado: "pendiente" | "programado" | "realizado" | "cancelado"
  tecnico_id?: number
  resultado?: string
  observaciones?: string
}

declare global {
  interface Window {
    electron?: {
      isElectron: boolean
      platform: string
    }
    api?: {
      send: (channel: string, data: any) => void
      receive: (channel: string, func: Function) => void
    }
  }
}
