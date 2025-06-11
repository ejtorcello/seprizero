// Base de datos en memoria para Vercel
interface Usuario {
  id: number
  username: string
  password: string
  nombre: string
  apellido: string
  email?: string
  rol: "recepcionista" | "medico" | "administrador" | "tecnico"
  activo: boolean
  created_at: string
}

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

interface Consultorio {
  id: number
  numero: string
  nombre: string
  activo: boolean
  created_at: string
}

// Datos en memoria
const usuarios: Usuario[] = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    nombre: "Juan",
    apellido: "Administrador",
    email: "admin@clinica.com",
    rol: "administrador",
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    username: "recep1",
    password: "recep123",
    nombre: "María",
    apellido: "González",
    email: "recepcion@clinica.com",
    rol: "recepcionista",
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    username: "dr.smith",
    password: "doc123",
    nombre: "Carlos",
    apellido: "Smith",
    email: "dr.smith@clinica.com",
    rol: "medico",
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    username: "tec1",
    password: "tec123",
    nombre: "Luis",
    apellido: "Técnico",
    email: "tecnico@clinica.com",
    rol: "tecnico",
    activo: true,
    created_at: new Date().toISOString(),
  },
]

const pacientes: Paciente[] = [
  {
    id: 1,
    dni: "12345678",
    nombre: "Pedro",
    apellido: "Martínez",
    fecha_nacimiento: "1980-05-15",
    telefono: "1234567890",
    email: "pedro@email.com",
    obra_social: "OSDE",
    numero_afiliado: "OS123456",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    dni: "87654321",
    nombre: "Laura",
    apellido: "Fernández",
    fecha_nacimiento: "1990-08-22",
    telefono: "0987654321",
    email: "laura@email.com",
    obra_social: "Swiss Medical",
    numero_afiliado: "SM789012",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    dni: "11111111",
    nombre: "Roberto",
    apellido: "López",
    fecha_nacimiento: "1975-12-10",
    telefono: "1111111111",
    email: "roberto@email.com",
    obra_social: "Particular",
    numero_afiliado: null,
    created_at: new Date().toISOString(),
  },
]

const consultorios: Consultorio[] = [
  {
    id: 1,
    numero: "101",
    nombre: "Consultorio Medicina General",
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    numero: "102",
    nombre: "Consultorio Cardiología",
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    numero: "103",
    nombre: "Consultorio Traumatología",
    activo: true,
    created_at: new Date().toISOString(),
  },
]

// Funciones de la base de datos en memoria
export const MemoryDB = {
  usuarios: {
    findAll: () => usuarios,
    findByUsername: (username: string) => usuarios.find((u) => u.username === username && u.activo),
    findById: (id: number) => usuarios.find((u) => u.id === id),
    create: (data: Omit<Usuario, "id" | "created_at">) => {
      const newUser: Usuario = {
        ...data,
        id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
        created_at: new Date().toISOString(),
      }
      usuarios.push(newUser)
      return newUser
    },
  },
  pacientes: {
    findAll: () => pacientes,
    findById: (id: number) => pacientes.find((p) => p.id === id),
    findByDni: (dni: string) => pacientes.find((p) => p.dni === dni),
    search: (query: string) =>
      pacientes.filter(
        (p) =>
          p.dni.includes(query) ||
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.apellido.toLowerCase().includes(query.toLowerCase()),
      ),
    create: (data: Omit<Paciente, "id" | "created_at">) => {
      const newPatient: Paciente = {
        ...data,
        id: Math.max(...pacientes.map((p) => p.id), 0) + 1,
        created_at: new Date().toISOString(),
      }
      pacientes.push(newPatient)
      return newPatient
    },
  },
  consultorios: {
    findAll: () => consultorios,
    findById: (id: number) => consultorios.find((c) => c.id === id),
  },
  // Función de test para verificar conectividad
  testConnection: () => {
    console.log("🔗 Conexión a BD en memoria exitosa. Usuarios:", usuarios.length)
    return true
  },
}

export type { Usuario, Paciente, Consultorio }
