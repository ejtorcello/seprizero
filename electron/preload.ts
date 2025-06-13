import { contextBridge, ipcRenderer } from "electron"

// Exponer APIs protegidas a la ventana del renderizador
contextBridge.exposeInMainWorld("electron", {
  // Puedes exponer funciones y variables aquí
  isElectron: true,
  platform: process.platform,
})

// También puedes exponer funciones para comunicarse con el proceso principal
contextBridge.exposeInMainWorld("api", {
  send: (channel: string, data: any) => {
    // Lista blanca de canales
    const validChannels = ["toMain"]
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: Function) => {
    // Lista blanca de canales
    const validChannels = ["fromMain"]
    if (validChannels.includes(channel)) {
      // Eliminar el oyente anterior para evitar duplicados
      ipcRenderer.removeAllListeners(channel)
      // Añadir nuevo oyente
      ipcRenderer.on(channel, (_, ...args) => func(...args))
    }
  },
})
