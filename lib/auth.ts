import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "clinica-secret-key"

export interface UserPayload {
  id: number
  username: string
  rol: string
  nombre: string
  apellido: string
}

export function verifyToken(request: NextRequest): UserPayload | null {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function requireRole(roles: string[]) {
  return (user: UserPayload | null): boolean => {
    if (!user) return false
    return roles.includes(user.rol)
  }
}
