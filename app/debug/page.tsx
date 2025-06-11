"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, Users, RefreshCw } from "lucide-react"

export default function DebugPage() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const checkDatabase = async () => {
    setLoading(true)
    try {
      // Verificar usuarios
      const usuariosResponse = await fetch("/api/debug/usuarios")
      const usuarios = await usuariosResponse.json()

      // Verificar pacientes
      const pacientesResponse = await fetch("/api/pacientes")
      const pacientes = await pacientesResponse.json()

      setDbStatus({
        usuarios: usuarios.length || 0,
        pacientes: pacientes.length || 0,
        dbConnected: true,
      })
    } catch (error) {
      console.error("Error checking database:", error)
      setDbStatus({
        usuarios: 0,
        pacientes: 0,
        dbConnected: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug - Estado del Sistema</h1>
          <p className="text-gray-600">Verificación del estado de la base de datos y conectividad</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado de la Base de Datos</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                ) : dbStatus?.dbConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={dbStatus?.dbConnected ? "default" : "destructive"}>
                  {loading ? "Verificando..." : dbStatus?.dbConnected ? "Conectada" : "Error"}
                </Badge>
              </div>
              {dbStatus?.error && <p className="text-sm text-red-600 mt-2">{dbStatus.error}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios del Sistema</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : dbStatus?.usuarios || 0}</div>
              <p className="text-xs text-muted-foreground">Usuarios registrados</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios de Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { user: "admin", pass: "admin123", role: "Administrador", color: "bg-purple-100 text-purple-800" },
                { user: "recep1", pass: "recep123", role: "Recepcionista", color: "bg-green-100 text-green-800" },
                { user: "dr.smith", pass: "doc123", role: "Médico", color: "bg-blue-100 text-blue-800" },
                { user: "tec1", pass: "tec123", role: "Técnico", color: "bg-orange-100 text-orange-800" },
              ].map((user, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{user.user}</p>
                    <p className="text-sm text-gray-600">{user.pass}</p>
                  </div>
                  <Badge className={user.color}>{user.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex space-x-4">
          <Button onClick={checkDatabase} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Verificar Estado
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/login")}>
            Ir al Login
          </Button>
        </div>
      </div>
    </div>
  )
}
