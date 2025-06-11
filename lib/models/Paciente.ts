import { MemoryDB, type Paciente } from "../database-memory"

export class PacienteModel {
  static findAll(): Paciente[] {
    try {
      return MemoryDB.pacientes.findAll()
    } catch (error) {
      console.error("❌ Error obteniendo pacientes:", error)
      return []
    }
  }

  static findById(id: number): Paciente | undefined {
    try {
      return MemoryDB.pacientes.findById(id)
    } catch (error) {
      console.error("❌ Error buscando paciente por ID:", error)
      return undefined
    }
  }

  static findByDni(dni: string): Paciente | undefined {
    try {
      return MemoryDB.pacientes.findByDni(dni)
    } catch (error) {
      console.error("❌ Error buscando paciente por DNI:", error)
      return undefined
    }
  }

  static create(data: Omit<Paciente, "id" | "created_at">): Paciente {
    try {
      return MemoryDB.pacientes.create(data)
    } catch (error) {
      console.error("❌ Error creando paciente:", error)
      throw error
    }
  }

  static search(query: string): Paciente[] {
    try {
      return MemoryDB.pacientes.search(query)
    } catch (error) {
      console.error("❌ Error buscando pacientes:", error)
      return []
    }
  }
}

export type { Paciente }
