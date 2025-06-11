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
    const stmt = db.prepare("SELECT * FROM usuarios WHERE username = ? AND activo = 1")
    return stmt.get(username) as Usuario
  }

  static findAll(): Usuario[] {
    const stmt = db.prepare("SELECT * FROM usuarios ORDER BY nombre, apellido")
    return stmt.all() as Usuario[]
  }

  static create(usuario: Omit<Usuario, "id" | "created_at">): Usuario {
    const stmt = db.prepare(`
      INSERT INTO usuarios (username, password, nombre, apellido, email, rol, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      usuario.username,
      usuario.password,
      usuario.nombre,
      usuario.apellido,
      usuario.email,
      usuario.rol,
      usuario.activo ?? true,
    )

    return { ...usuario, id: result.lastInsertRowid as number }
  }

  static findById(id: number): Usuario | undefined {
    const stmt = db.prepare("SELECT * FROM usuarios WHERE id = ?")
    return stmt.get(id) as Usuario
  }

  static update(id: number, usuario: Partial<Usuario>): boolean {
    const fields = Object.keys(usuario).filter((key) => key !== "id")
    const values = fields.map((field) => usuario[field as keyof Usuario])

    const stmt = db.prepare(`
      UPDATE usuarios 
      SET ${fields.map((field) => `${field} = ?`).join(", ")}
      WHERE id = ?
    `)

    const result = stmt.run(...values, id)
    return result.changes > 0
  }
}
