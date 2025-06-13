// Constantes de la aplicación
export const APP_CONFIG = {
  name: "SEPRICE",
  version: "1.0.0",
  description: "Sistema de Gestión Médica",
  author: "SEPRICE Team",
  website: "https://seprice.com",
  support_email: "soporte@seprice.com",
  support_phone: "+54 11 1234-5678",
}

export const ROLES = {
  ADMINISTRADOR: "administrador",
  RECEPCIONISTA: "recepcionista",
  MEDICO: "medico",
  TECNICO: "tecnico",
} as const

export const ESTADOS_TURNO = {
  PROGRAMADO: "programado",
  ATENDIDO: "atendido",
  CANCELADO: "cancelado",
  AUSENTE: "ausente",
} as const

export const ESTADOS_ESTUDIO = {
  PENDIENTE: "pendiente",
  PROGRAMADO: "programado",
  REALIZADO: "realizado",
  CANCELADO: "cancelado",
} as const

export const MODALIDADES_PAGO = {
  OBRA_SOCIAL: "obra_social",
  PARTICULAR: "particular",
} as const

export const ORIGENES_ORDEN = {
  AMBULATORIO: "ambulatorio",
  GUARDIA: "guardia",
  INTERNACION: "internacion",
} as const

export const OBRAS_SOCIALES = [
  "Particular",
  "OSDE",
  "Swiss Medical",
  "Galeno",
  "IOMA",
  "PAMI",
  "Medicus",
  "Sancor Salud",
  "Otra",
] as const

export const ESPECIALIDADES_MEDICAS = [
  "Medicina General",
  "Cardiología",
  "Traumatología",
  "Ginecología",
  "Pediatría",
  "Dermatología",
  "Neurología",
  "Oftalmología",
  "Otorrinolaringología",
  "Urología",
] as const

export const TIPOS_ESTUDIOS = [
  "Radiografía",
  "Tomografía Computada",
  "Resonancia Magnética",
  "Ecografía",
  "Análisis de Sangre",
  "Electrocardiograma",
  "Mamografía",
  "Endoscopía",
  "Colonoscopía",
  "Densitometría Ósea",
] as const

export const HORARIOS_ATENCION = {
  INICIO: "08:00",
  FIN: "18:00",
  DURACION_TURNO_DEFAULT: 30, // minutos
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  DISPLAY_WITH_TIME: "DD/MM/YYYY HH:mm",
  API: "YYYY-MM-DD",
  API_WITH_TIME: "YYYY-MM-DD HH:mm:ss",
} as const
