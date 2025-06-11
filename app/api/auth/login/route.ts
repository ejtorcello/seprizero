import { type NextRequest, NextResponse } from "next/server"
import { UsuarioModel } from "@/lib/models/Usuario"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "clinica-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("🔐 Intento de login:", { username })

    if (!username || !password) {
      return NextResponse.json({ error: "Username y password son requeridos" }, { status: 400 })
    }

    const usuario = UsuarioModel.findByUsername(username)
    console.log("👤 Usuario encontrado:", usuario ? "Sí" : "No")

    if (!usuario || usuario.password !== password) {
      console.log("❌ Credenciales inválidas")
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
      JWT_SECRET,
      { expiresIn: "8h" },
    )

    const response = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 horas
    })

    console.log("✅ Login exitoso para:", usuario.username)
    return response
  } catch (error) {
    console.error("❌ Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
