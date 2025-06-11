import { type NextRequest, NextResponse } from "next/server"
import { TurnoModel } from "@/lib/models/Turno"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha")

    let turnos
    if (fecha) {
      turnos = TurnoModel.findByDate(fecha)
    } else {
      turnos = TurnoModel.findAll()
    }

    return NextResponse.json(turnos)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener turnos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const turno = TurnoModel.create(data)
    return NextResponse.json(turno, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear turno" }, { status: 500 })
  }
}
