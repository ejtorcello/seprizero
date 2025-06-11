import { MemoryDB, type Usuario } from "../database-memory"

export class UsuarioModel {
  static findByUsername(username: string): Usuario | undefined {
    try {
      console.log("🔍 Buscando usuario:", username)
      const usuario = MemoryDB.usuarios.findByUsername(username)
      console.log("👤 Usuario encontrado:", usuario ? "Sí" : "No")
      if (usuario) {
        console.log("📋 Datos del usuario:", { id: usuario.id, username: usuario.username, rol: usuario.rol })
      }
      return usuario
    } catch (error) {
      console.error("❌ Error buscando usuario:", error)
      return undefined
    }
  }

  static findAll(): Usuario[] {
    try {
      return MemoryDB.usuarios.findAll()
    } catch (error) {
      console.error("❌ Error obteniendo usuarios:", error)
      return []
    }
  }

  static findById(id: number): Usuario | undefined {
    try {
      return MemoryDB.usuarios.findById(id)
    } catch (error) {
      console.error("❌ Error buscando usuario por ID:", error)
      return undefined
    }
  }

  static create(data: Omit<Usuario, "id" | "created_at">): Usuario {
    try {
      return MemoryDB.usuarios.create(data)
    } catch (error) {
      console.error("❌ Error creando usuario:", error)
      throw error
    }
  }

  // Método para verificar la base de datos
  static testConnection(): boolean {
    try {
      return MemoryDB.testConnection()
    } catch (error) {
      console.error("❌ Error de conexión a BD:", error)
      return false
    }
  }
}

export type { Usuario }
