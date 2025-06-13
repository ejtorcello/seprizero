import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "SEPRICE - Sistema de Gestión Médica",
  description:
    "Sistema integral de gestión clínica para consultorios externos y estudios clínicos. Administración de turnos, pacientes, estudios médicos y liquidaciones.",
  keywords: "clínica, gestión médica, turnos, pacientes, estudios clínicos, sistema hospitalario, SEPRICE",
  authors: [{ name: "SEPRICE" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
