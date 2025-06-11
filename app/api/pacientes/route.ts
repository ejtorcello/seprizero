import { type NextRequest, NextResponse } from "next/server"
import { PacienteModel } from "@/lib/models/Paciente"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let pacientes
    if (search) {
      pacientes = PacienteModel.search(search)
    } else {
      pacientes = PacienteModel.findAll()
    }

    return NextResponse.json(pacientes)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener pacientes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Verificar si ya existe un paciente con ese DNI
    if (PacienteModel.findByDni(data.dni)) {
      return NextResponse.json({ error: "Ya existe un paciente con ese DNI" }, { status: 400 })
    }

    const paciente = PacienteModel.create(data)
    return NextResponse.json(paciente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear paciente" }, { status: 500 })
  }
}
