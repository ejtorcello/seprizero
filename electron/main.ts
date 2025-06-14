import { app, BrowserWindow, Menu, dialog, shell } from "electron"
import * as path from "path"
import { spawn, type ChildProcess } from "child_process"
import isDev from "electron-is-dev"

// Mantener una referencia global del objeto window
let mainWindow: BrowserWindow | null = null
let nextApp: ChildProcess | null = null
let isQuiting = false
const nextAppPort = 3000

// Configurar el protocolo de la aplicación
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("seprice", process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient("seprice")
}

// Prevenir múltiples instancias
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on("second-instance", () => {
    // Alguien intentó ejecutar una segunda instancia, enfocamos nuestra ventana
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function createMenu() {
  const template: any = [
    {
      label: "Archivo",
      submenu: [
        {
          label: "Salir",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit()
          },
        },
      ],
    },
    {
      label: "Ver",
      submenu: [
        { role: "reload", label: "Recargar" },
        { role: "forceReload", label: "Forzar Recarga" },
        { role: "toggleDevTools", label: "Herramientas de Desarrollador" },
        { type: "separator" },
        { role: "resetZoom", label: "Zoom Normal" },
        { role: "zoomIn", label: "Acercar" },
        { role: "zoomOut", label: "Alejar" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Pantalla Completa" },
      ],
    },
    {
      label: "Ayuda",
      submenu: [
        {
          label: "Acerca de SEPRICE",
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: "info",
              title: "Acerca de SEPRICE",
              message: "SEPRICE - Sistema de Gestión Médica",
              detail: "Versión 1.0.0\n\nSistema integral para la gestión de centros médicos y diagnósticos.",
              buttons: ["OK"],
            })
          },
        },
        {
          label: "Soporte Técnico",
          click: () => {
            shell.openExternal("mailto:soporte@seprice.com")
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    icon: path.join(__dirname, "../public/icon.png"),
    show: false,
    titleBarStyle: "default",
    autoHideMenuBar: false,
  })

  // Configurar el título de la ventana
  mainWindow.setTitle("SEPRICE - Sistema de Gestión Médica")

  // Crear menú
  createMenu()

  // Mostrar pantalla de carga
  mainWindow.loadFile(path.join(__dirname, "../electron/splash.html"))

  // Configurar eventos de seguridad - Usar la nueva API
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  // Iniciar la aplicación Next.js
  startNextApp()

  // Mostrar la ventana cuando esté lista
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show()

    // Centrar la ventana
    mainWindow?.center()

    // En desarrollo, abrir DevTools
    if (isDev) {
      mainWindow?.webContents.openDevTools()
    }
  })

  // Emitido cuando la ventana es cerrada
  mainWindow.on("closed", () => {
    mainWindow = null
    if (nextApp) {
      nextApp.kill("SIGINT")
      nextApp = null
    }
  })

  // Manejar el evento antes de cerrar
  mainWindow.on("close", (event) => {
    if (!isQuiting) {
      event.preventDefault()
      dialog
        .showMessageBox(mainWindow!, {
          type: "question",
          buttons: ["Sí", "No"],
          defaultId: 0,
          message: "¿Está seguro que desea cerrar SEPRICE?",
        })
        .then((result) => {
          if (result.response === 0) {
            isQuiting = true
            app.quit()
          }
        })
    }
  })
}

function startNextApp() {
  const serverPath = isDev
    ? path.join(__dirname, "../node_modules/next/dist/bin/next")
    : path.join(__dirname, "../server.js")

  const args = isDev ? ["dev"] : []
  const command = isDev ? "node" : "node"

  if (isDev) {
    console.log("Ejecutando en modo desarrollo")
    nextApp = spawn(command, [serverPath, ...args], {
      cwd: path.join(__dirname, ".."),
      stdio: "pipe",
      env: { ...process.env, PORT: nextAppPort.toString() },
      shell: true,
    })
  } else {
    console.log("Ejecutando en modo producción")
    nextApp = spawn(command, [serverPath], {
      cwd: path.join(__dirname, ".."),
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: nextAppPort.toString(),
        ELECTRON: "true",
      },
      stdio: "pipe",
      shell: true,
    })
  }

  // Manejar la salida del proceso Next.js
  nextApp.stdout?.on("data", (data: Buffer) => {
    const message = data.toString()
    console.log(message)

    // Cuando Next.js está listo, cargar la aplicación
    if (message.includes("ready") || message.includes("started") || message.includes("Ready")) {
      setTimeout(() => {
        if (mainWindow) {
          const url = `http://localhost:${nextAppPort}`
          console.log(`Cargando aplicación desde: ${url}`)
          mainWindow.loadURL(url).catch((err) => {
            console.error("Error cargando URL:", err)
            // Reintentar después de un momento
            setTimeout(() => {
              mainWindow?.loadURL(url)
            }, 2000)
          })
        }
      }, 1500)
    }
  })

  nextApp.stderr?.on("data", (data: Buffer) => {
    console.error("Next.js Error:", data.toString())
  })

  nextApp.on("close", (code: number) => {
    console.log(`Next.js se cerró con código: ${code}`)
  })

  nextApp.on("error", (error: Error) => {
    console.error("Error iniciando Next.js:", error)
    dialog.showErrorBox("Error", "No se pudo iniciar el servidor de la aplicación.")
  })
}

// Este método será llamado cuando Electron haya terminado la inicialización
app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (mainWindow === null) createWindow()
  })
})

// Salir cuando todas las ventanas estén cerradas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
