import db from "../database"

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

export class TurnoModel {
  static findAll(): TurnoDetallado[] {
    const stmt = db.prepare(`
      SELECT 
        t.*,
        p.nombre as paciente_nombre,
        p.apellido as paciente_apellido,
        p.dni as paciente_dni,
        u.nombre as medico_nombre,
        u.apellido as medico_apellido,
        m.especialidad as medico_especialidad,
        c.numero as consultorio_numero,
        c.nombre as consultorio_nombre
      FROM turnos t
      JOIN pacientes p ON t.paciente_id = p.id
      JOIN medicos m ON t.medico_id = m.id
      JOIN usuarios u ON m.usuario_id = u.id
      JOIN consultorios c ON t.consultorio_id = c.id
      ORDER BY t.fecha_hora DESC
    `)
    return stmt.all() as TurnoDetallado[]
  }

  static findByDate(fecha: string): TurnoDetallado[] {
    const stmt = db.prepare(`
      SELECT 
        t.*,
        p.nombre as paciente_nombre,
        p.apellido as paciente_apellido,
        p.dni as paciente_dni,
        u.nombre as medico_nombre,
        u.apellido as medico_apellido,
        m.especialidad as medico_especialidad,
        c.numero as consultorio_numero,
        c.nombre as consultorio_nombre
      FROM turnos t
      JOIN pacientes p ON t.paciente_id = p.id
      JOIN medicos m ON t.medico_id = m.id
      JOIN usuarios u ON m.usuario_id = u.id
      JOIN consultorios c ON t.consultorio_id = c.id
      WHERE DATE(t.fecha_hora) = ?
      ORDER BY t.fecha_hora
    `)
    return stmt.all(fecha) as TurnoDetallado[]
  }

  static create(turno: Omit<Turno, "id" | "created_at">): Turno {
    const stmt = db.prepare(`
      INSERT INTO turnos (paciente_id, medico_id, consultorio_id, fecha_hora, duracion_minutos, estado, modalidad_pago, monto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      turno.paciente_id,
      turno.medico_id,
      turno.consultorio_id,
      turno.fecha_hora,
      turno.duracion_minutos ?? 30,
      turno.estado ?? "programado",
      turno.modalidad_pago,
      turno.monto,
    )

    return { ...turno, id: result.lastInsertRowid as number }
  }

  static update(id: number, turno: Partial<Turno>): boolean {
    const fields = Object.keys(turno).filter((key) => key !== "id")
    const values = fields.map((field) => turno[field as keyof Turno])

    const stmt = db.prepare(`
      UPDATE turnos 
      SET ${fields.map((field) => `${field} = ?`).join(", ")}
      WHERE id = ?
    `)

    const result = stmt.run(...values, id)
    return result.changes > 0
  }

  static findById(id: number): TurnoDetallado | undefined {
    const stmt = db.prepare(`
      SELECT 
        t.*,
        p.nombre as paciente_nombre,
        p.apellido as paciente_apellido,
        p.dni as paciente_dni,
        u.nombre as medico_nombre,
        u.apellido as medico_apellido,
        m.especialidad as medico_especialidad,
        c.numero as consultorio_numero,
        c.nombre as consultorio_nombre
      FROM turnos t
      JOIN pacientes p ON t.paciente_id = p.id
      JOIN medicos m ON t.medico_id = m.id
      JOIN usuarios u ON m.usuario_id = u.id
      JOIN consultorios c ON t.consultorio_id = c.id
      WHERE t.id = ?
    `)
    return stmt.get(id) as TurnoDetallado
  }
}
