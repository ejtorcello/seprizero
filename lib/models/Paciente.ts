import db from "../database"

export interface Paciente {
  id?: number
  dni: string
  nombre: string
  apellido: string
  fecha_nacimiento?: string
  telefono?: string
  email?: string
  direccion?: string
  obra_social?: string
  numero_afiliado?: string
  created_at?: string
}

export class PacienteModel {
  static findAll(): Paciente[] {
    const stmt = db.prepare("SELECT * FROM pacientes ORDER BY apellido, nombre")
    return stmt.all() as Paciente[]
  }

  static findById(id: number): Paciente | undefined {
    const stmt = db.prepare("SELECT * FROM pacientes WHERE id = ?")
    return stmt.get(id) as Paciente
  }

  static findByDni(dni: string): Paciente | undefined {
    const stmt = db.prepare("SELECT * FROM pacientes WHERE dni = ?")
    return stmt.get(dni) as Paciente
  }

  static create(paciente: Omit<Paciente, "id" | "created_at">): Paciente {
    const stmt = db.prepare(`
      INSERT INTO pacientes (dni, nombre, apellido, fecha_nacimiento, telefono, email, direccion, obra_social, numero_afiliado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      paciente.dni,
      paciente.nombre,
      paciente.apellido,
      paciente.fecha_nacimiento,
      paciente.telefono,
      paciente.email,
      paciente.direccion,
      paciente.obra_social,
      paciente.numero_afiliado,
    )

    return { ...paciente, id: result.lastInsertRowid as number }
  }

  static update(id: number, paciente: Partial<Paciente>): boolean {
    const fields = Object.keys(paciente).filter((key) => key !== "id")
    const values = fields.map((field) => paciente[field as keyof Paciente])

    const stmt = db.prepare(`
      UPDATE pacientes 
      SET ${fields.map((field) => `${field} = ?`).join(", ")}
      WHERE id = ?
    `)

    const result = stmt.run(...values, id)
    return result.changes > 0
  }

  static search(query: string): Paciente[] {
    const stmt = db.prepare(`
      SELECT * FROM pacientes 
      WHERE dni LIKE ? OR nombre LIKE ? OR apellido LIKE ?
      ORDER BY apellido, nombre
    `)

    const searchTerm = `%${query}%`
    return stmt.all(searchTerm, searchTerm, searchTerm) as Paciente[]
  }
}
