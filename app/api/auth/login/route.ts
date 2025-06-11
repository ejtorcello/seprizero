import { type NextRequest, NextResponse } from "next/server"
import { UsuarioModel } from "@/lib/models/Usuario"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Iniciando proceso de login...")

    const { username, password } = await request.json()
    console.log("📝 Datos recibidos:", { username, password: password ? "***" : "vacío" })

    if (!username || !password) {
      console.log("❌ Faltan datos")
      return NextResponse.json({ error: "Username y password son requeridos" }, { status: 400 })
    }

    // Verificar conexión a la base de datos
    const dbConnected = UsuarioModel.testConnection()
    if (!dbConnected) {
      console.log("❌ Error de conexión a la base de datos")
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    // Buscar usuario
    const usuario = UsuarioModel.findByUsername(username)
    console.log("👤 Usuario encontrado:", usuario ? "Sí" : "No")

    if (!usuario) {
      console.log("❌ Usuario no encontrado")
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    // Verificar contraseña (texto plano)
    console.log("🔑 Verificando contraseña...")

    if (usuario.password !== password) {
      console.log("❌ Contraseña incorrecta")
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    console.log("✅ Login exitoso")

    // Crear respuesta simple
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

    // Guardar datos del usuario en una cookie simple
    response.cookies.set(
      "user",
      JSON.stringify({
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8, // 8 horas
      },
    )

    return response
  } catch (error) {
    console.error("❌ Error en login:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
