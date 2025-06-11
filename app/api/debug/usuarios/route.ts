import { NextResponse } from "next/server"
import { UsuarioModel } from "@/lib/models/Usuario"

export async function GET() {
  try {
    const usuarios = UsuarioModel.findAll()
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("Error getting usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}
