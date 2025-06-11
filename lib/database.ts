import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "clinica.db")

// Crear la base de datos
const db = new Database(dbPath)

// Configurar SQLite para mejor rendimiento
db.pragma("journal_mode = WAL")
db.pragma("synchronous = NORMAL")
db.pragma("foreign_keys = ON")

// Función para inicializar la base de datos
function initDB() {
  console.log("🔄 Inicializando base de datos...")

  try {
    // Crear tabla de usuarios
    db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT,
        rol TEXT NOT NULL,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de pacientes
    db.exec(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        fecha_nacimiento DATE,
        telefono TEXT,
        email TEXT,
        direccion TEXT,
        obra_social TEXT,
        numero_afiliado TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de consultorios
    db.exec(`
      CREATE TABLE IF NOT EXISTS consultorios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Verificar si ya hay usuarios
    const userCount = db.prepare("SELECT COUNT(*) as count FROM usuarios").get() as { count: number }

    if (userCount.count === 0) {
      console.log("📝 Insertando usuarios de prueba...")

      // Insertar usuarios de prueba
      const insertUser = db.prepare(`
        INSERT INTO usuarios (username, password, nombre, apellido, email, rol) 
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      insertUser.run("admin", "admin123", "Juan", "Administrador", "admin@clinica.com", "administrador")
      insertUser.run("recep1", "recep123", "María", "González", "recepcion@clinica.com", "recepcionista")
      insertUser.run("dr.smith", "doc123", "Carlos", "Smith", "dr.smith@clinica.com", "medico")
      insertUser.run("tec1", "tec123", "Luis", "Técnico", "tecnico@clinica.com", "tecnico")

      console.log("✅ Usuarios insertados")
    }

    // Verificar si ya hay pacientes
    const patientCount = db.prepare("SELECT COUNT(*) as count FROM pacientes").get() as { count: number }

    if (patientCount.count === 0) {
      console.log("📝 Insertando pacientes de prueba...")

      const insertPatient = db.prepare(`
        INSERT INTO pacientes (dni, nombre, apellido, fecha_nacimiento, telefono, email, obra_social, numero_afiliado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      insertPatient.run(
        "12345678",
        "Pedro",
        "Martínez",
        "1980-05-15",
        "1234567890",
        "pedro@email.com",
        "OSDE",
        "OS123456",
      )
      insertPatient.run(
        "87654321",
        "Laura",
        "Fernández",
        "1990-08-22",
        "0987654321",
        "laura@email.com",
        "Swiss Medical",
        "SM789012",
      )
      insertPatient.run(
        "11111111",
        "Roberto",
        "López",
        "1975-12-10",
        "1111111111",
        "roberto@email.com",
        "Particular",
        null,
      )

      console.log("✅ Pacientes insertados")
    }

    // Verificar si ya hay consultorios
    const consultorioCount = db.prepare("SELECT COUNT(*) as count FROM consultorios").get() as { count: number }

    if (consultorioCount.count === 0) {
      console.log("📝 Insertando consultorios de prueba...")

      const insertConsultorio = db.prepare(`
        INSERT INTO consultorios (numero, nombre) 
        VALUES (?, ?)
      `)

      insertConsultorio.run("101", "Consultorio Medicina General")
      insertConsultorio.run("102", "Consultorio Cardiología")
      insertConsultorio.run("103", "Consultorio Traumatología")

      console.log("✅ Consultorios insertados")
    }

    console.log("✅ Base de datos inicializada correctamente")
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error)
  }
}

// Inicializar la base de datos
initDB()

export default db
