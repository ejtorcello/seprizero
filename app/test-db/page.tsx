"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestDBPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando usuarios...")

      const response = await fetch("/api/debug/usuarios")
      console.log("📡 Respuesta:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Usuarios cargados:", data)
        setUsuarios(data)
        setError("")
      } else {
        const errorData = await response.json()
        console.log("❌ Error:", errorData)
        setError(errorData.error || "Error desconocido")
      }
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async (username: string, password: string) => {
    try {
      console.log("🔐 Probando login:", { username, password })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log("📡 Resultado login:", data)

      if (response.ok) {
        alert("✅ Login exitoso: " + JSON.stringify(data.user))
      } else {
        alert("❌ Error en login: " + data.error)
      }
    } catch (err) {
      console.error("❌ Error en test login:", err)
      alert("❌ Error: " + err.message)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Base de Datos</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Estado de la Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            {!loading && !error && (
              <p className="text-green-600">✅ Base de datos funcionando. {usuarios.length} usuarios encontrados.</p>
            )}
            <Button onClick={loadUsuarios} className="mt-4">
              Recargar
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Usuarios en la Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            {usuarios.length > 0 ? (
              <div className="space-y-2">
                {usuarios.map((usuario: any) => (
                  <div key={usuario.id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                    <div>
                      <strong>{usuario.username}</strong> - {usuario.nombre} {usuario.apellido} ({usuario.rol})
                      <br />
                      <small>Password: {usuario.password}</small>
                    </div>
                    <Button size="sm" onClick={() => testLogin(usuario.username, usuario.password)}>
                      Test Login
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay usuarios</p>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button onClick={() => (window.location.href = "/login")}>Ir al Login</Button>
          <Button onClick={() => (window.location.href = "/dashboard")}>Ir al Dashboard</Button>
        </div>
      </div>
    </div>
  )
}
