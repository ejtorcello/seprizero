import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get("user")?.value

    if (!userCookie) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = JSON.parse(userCookie)
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error verificando usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
