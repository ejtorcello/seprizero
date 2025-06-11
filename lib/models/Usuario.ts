import db from "../database"

export interface Usuario {
  id?: number
  username: string
  password: string
  nombre: string
  apellido: string
  email?: string
  rol: "recepcionista" | "medico" | "administrador" | "tecnico"
  activo?: boolean
  created_at?: string
}

export class UsuarioModel {
  static findByUsername(username: string): Usuario | undefined {
    try {
      console.log("🔍 Buscando usuario:", username)
      const stmt = db.prepare("SELECT * FROM usuarios WHERE username = ? AND activo = 1")
      const usuario = stmt.get(username) as Usuario
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
      const stmt = db.prepare("SELECT * FROM usuarios ORDER BY nombre, apellido")
      return stmt.all() as Usuario[]
    } catch (error) {
      console.error("❌ Error obteniendo usuarios:", error)
      return []
    }
  }

  static findById(id: number): Usuario | undefined {
    try {
      const stmt = db.prepare("SELECT * FROM usuarios WHERE id = ?")
      return stmt.get(id) as Usuario
    } catch (error) {
      console.error("❌ Error buscando usuario por ID:", error)
      return undefined
    }
  }

  // Método para verificar la base de datos
  static testConnection(): boolean {
    try {
      const result = db.prepare("SELECT COUNT(*) as count FROM usuarios").get() as { count: number }
      console.log("🔗 Conexión a BD exitosa. Usuarios:", result.count)
      return true
    } catch (error) {
      console.error("❌ Error de conexión a BD:", error)
      return false
    }
  }
}
