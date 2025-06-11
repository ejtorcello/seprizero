import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "clinica.db")
const db = new Database(dbPath)

// Configurar SQLite para mejor rendimiento
db.pragma("journal_mode = WAL")
db.pragma("synchronous = NORMAL")
db.pragma("foreign_keys = ON")

// Inicializar la base de datos automáticamente
import { initializeDatabase } from "./init-db"

// Solo inicializar en desarrollo o si no existe la base de datos
if (process.env.NODE_ENV === "development" || !require("fs").existsSync(dbPath)) {
  initializeDatabase()
}

export default db
