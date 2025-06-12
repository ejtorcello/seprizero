import { app, BrowserWindow } from "electron"
import * as path from "path"
import { spawn } from "child_process"
import isDev from "electron-is-dev"

// Mantener una referencia global del objeto window para evitar
// que la ventana se cierre automáticamente cuando el objeto JavaScript sea recogido por el recolector de basura.
let mainWindow: BrowserWindow | null = null
let nextApp: any = null
const nextAppPort = 3000

function createWindow() {
  // Crear la ventana del navegador.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../public/favicon.ico"),
    show: false,
  })

  // Configurar el título de la ventana
  mainWindow.setTitle("SEPRICE - Sistema de Gestión Médica")

  // Eliminar la barra de menú
  mainWindow.setMenuBarVisibility(false)

  // Mostrar pantalla de carga mientras Next.js inicia
  mainWindow.loadFile(path.join(__dirname, "../electron/splash.html"))

  // Iniciar la aplicación Next.js
  startNextApp()

  // Mostrar la ventana cuando esté lista
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show()
  })

  // Emitido cuando la ventana es cerrada.
  mainWindow.on("closed", () => {
    mainWindow = null
    if (nextApp) {
      nextApp.kill("SIGINT")
      nextApp = null
    }
  })
}

function startNextApp() {
  // En desarrollo, usamos el servidor de desarrollo de Next.js
  if (isDev) {
    console.log("Ejecutando en modo desarrollo")
    const nextPath = path.join(__dirname, "../node_modules/next/dist/bin/next")
    nextApp = spawn("node", [nextPath, "dev"], {
      cwd: path.join(__dirname, ".."),
      stdio: "pipe",
    })
  } else {
    // En producción, usamos el servidor Next.js construido
    console.log("Ejecutando en modo producción")
    nextApp = spawn("node", ["server.js"], {
      cwd: path.join(__dirname, ".."),
      env: { ...process.env, NODE_ENV: "production", PORT: nextAppPort.toString() },
      stdio: "pipe",
    })
  }

  // Manejar la salida del proceso Next.js
  nextApp.stdout?.on("data", (data: Buffer) => {
    const message = data.toString()
    console.log(message)

    // Cuando Next.js está listo, cargar la aplicación
    if (message.includes("ready") && message.includes("started")) {
      setTimeout(() => {
        if (mainWindow) {
          const url = isDev ? `http://localhost:${nextAppPort}` : `http://localhost:${nextAppPort}`
          console.log(`Cargando aplicación desde: ${url}`)
          mainWindow.loadURL(url)
        }
      }, 1000) // Pequeño retraso para asegurar que el servidor esté completamente listo
    }
  })

  nextApp.stderr?.on("data", (data: Buffer) => {
    console.error(data.toString())
  })

  nextApp.on("close", (code: number) => {
    console.log(`Next.js se cerró con código: ${code}`)
  })
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse solo después de que este evento ocurra.
app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando
    // el icono del dock es clickeado y no hay otras ventanas abiertas.
    if (mainWindow === null) createWindow()
  })
})

// Salir cuando todas las ventanas estén cerradas, excepto en macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

// En este archivo puedes incluir el resto del código específico del proceso principal de tu aplicación.
// También puedes ponerlos en archivos separados y requerirlos aquí.
