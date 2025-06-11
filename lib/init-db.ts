import db from "./database"

export function initializeDatabase() {
  try {
    console.log("🔄 Inicializando base de datos...")

    // Verificar si las tablas ya existen
    const tables = db
      .prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `)
      .all()

    if (tables.length === 0) {
      console.log("📋 Creando tablas...")

      // Crear tablas
      const createTablesSQL = `
        -- Tabla de usuarios del sistema (roles)
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE,
            rol VARCHAR(20) NOT NULL CHECK (rol IN ('recepcionista', 'medico', 'administrador', 'tecnico')),
            activo BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabla de pacientes
        CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dni VARCHAR(20) UNIQUE NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            fecha_nacimiento DATE,
            telefono VARCHAR(20),
            email VARCHAR(100),
            direccion TEXT,
            obra_social VARCHAR(100),
            numero_afiliado VARCHAR(50),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabla de consultorios
        CREATE TABLE IF NOT EXISTS consultorios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero VARCHAR(10) UNIQUE NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            activo BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabla de médicos (especialización de usuarios)
        CREATE TABLE IF NOT EXISTS medicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            matricula VARCHAR(20) UNIQUE NOT NULL,
            especialidad VARCHAR(100) NOT NULL,
            valor_consulta DECIMAL(10,2) DEFAULT 0,
            activo BOOLEAN DEFAULT 1,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );

        -- Tabla de turnos
        CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_id INTEGER NOT NULL,
            medico_id INTEGER NOT NULL,
            consultorio_id INTEGER NOT NULL,
            fecha_hora DATETIME NOT NULL,
            duracion_minutos INTEGER DEFAULT 30,
            estado VARCHAR(20) DEFAULT 'programado' CHECK (estado IN ('programado', 'atendido', 'cancelado', 'ausente')),
            modalidad_pago VARCHAR(20) CHECK (modalidad_pago IN ('obra_social', 'particular')),
            monto DECIMAL(10,2),
            diagnostico TEXT,
            observaciones TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
            FOREIGN KEY (medico_id) REFERENCES medicos(id),
            FOREIGN KEY (consultorio_id) REFERENCES consultorios(id)
        );

        -- Tabla de tipos de estudios clínicos
        CREATE TABLE IF NOT EXISTS tipos_estudios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre VARCHAR(100) NOT NULL,
            descripcion TEXT,
            costo DECIMAL(10,2) DEFAULT 0,
            duracion_minutos INTEGER DEFAULT 30,
            requiere_insumos BOOLEAN DEFAULT 0,
            activo BOOLEAN DEFAULT 1
        );

        -- Tabla de órdenes médicas
        CREATE TABLE IF NOT EXISTS ordenes_medicas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_id INTEGER NOT NULL,
            medico_id INTEGER NOT NULL,
            turno_id INTEGER,
            fecha_orden DATE NOT NULL,
            estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'programada', 'realizada', 'cancelada')),
            origen VARCHAR(20) DEFAULT 'ambulatorio' CHECK (origen IN ('ambulatorio', 'guardia', 'internacion')),
            observaciones TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
            FOREIGN KEY (medico_id) REFERENCES medicos(id),
            FOREIGN KEY (turno_id) REFERENCES turnos(id)
        );

        -- Tabla de estudios solicitados (detalle de órdenes médicas)
        CREATE TABLE IF NOT EXISTS estudios_solicitados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orden_medica_id INTEGER NOT NULL,
            tipo_estudio_id INTEGER NOT NULL,
            fecha_programada DATETIME,
            fecha_realizada DATETIME,
            estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'programado', 'realizado', 'cancelado')),
            tecnico_id INTEGER,
            resultado TEXT,
            observaciones TEXT,
            FOREIGN KEY (orden_medica_id) REFERENCES ordenes_medicas(id),
            FOREIGN KEY (tipo_estudio_id) REFERENCES tipos_estudios(id),
            FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
        );

        -- Tabla de insumos
        CREATE TABLE IF NOT EXISTS insumos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre VARCHAR(100) NOT NULL,
            descripcion TEXT,
            stock_actual INTEGER DEFAULT 0,
            stock_minimo INTEGER DEFAULT 0,
            unidad_medida VARCHAR(20),
            costo_unitario DECIMAL(10,2) DEFAULT 0,
            activo BOOLEAN DEFAULT 1
        );

        -- Tabla de insumos utilizados en estudios
        CREATE TABLE IF NOT EXISTS insumos_estudios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estudio_id INTEGER NOT NULL,
            insumo_id INTEGER NOT NULL,
            cantidad_utilizada INTEGER NOT NULL,
            fecha_uso DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (estudio_id) REFERENCES estudios_solicitados(id),
            FOREIGN KEY (insumo_id) REFERENCES insumos(id)
        );

        -- Tabla de liquidación de honorarios
        CREATE TABLE IF NOT EXISTS liquidaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medico_id INTEGER NOT NULL,
            periodo_desde DATE NOT NULL,
            periodo_hasta DATE NOT NULL,
            total_honorarios DECIMAL(12,2) DEFAULT 0,
            estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesada', 'pagada')),
            fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (medico_id) REFERENCES medicos(id)
        );
      `

      // Ejecutar cada statement por separado
      const statements = createTablesSQL.split(";").filter((stmt) => stmt.trim())
      statements.forEach((stmt) => {
        if (stmt.trim()) {
          db.exec(stmt)
        }
      })

      console.log("✅ Tablas creadas exitosamente")

      // Insertar datos iniciales
      console.log("📝 Insertando datos iniciales...")
      seedDatabase()
    } else {
      console.log("✅ Base de datos ya inicializada")
    }

    return true
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error)
    return false
  }
}

function seedDatabase() {
  try {
    // Insertar usuarios del sistema
    const insertUsuarios = db.prepare(`
      INSERT OR IGNORE INTO usuarios (username, password, nombre, apellido, email, rol) VALUES (?, ?, ?, ?, ?, ?)
    `)

    const usuarios = [
      ["admin", "admin123", "Juan", "Administrador", "admin@clinica.com", "administrador"],
      ["recep1", "recep123", "María", "González", "recepcion@clinica.com", "recepcionista"],
      ["dr.smith", "doc123", "Carlos", "Smith", "dr.smith@clinica.com", "medico"],
      ["dr.garcia", "doc123", "Ana", "García", "dr.garcia@clinica.com", "medico"],
      ["tec1", "tec123", "Luis", "Técnico", "tecnico@clinica.com", "tecnico"],
    ]

    usuarios.forEach((usuario) => {
      insertUsuarios.run(...usuario)
    })

    // Insertar consultorios
    const insertConsultorios = db.prepare(`
      INSERT OR IGNORE INTO consultorios (numero, nombre) VALUES (?, ?)
    `)

    const consultorios = [
      ["101", "Consultorio Medicina General"],
      ["102", "Consultorio Cardiología"],
      ["103", "Consultorio Traumatología"],
      ["201", "Consultorio Ginecología"],
      ["202", "Consultorio Pediatría"],
    ]

    consultorios.forEach((consultorio) => {
      insertConsultorios.run(...consultorio)
    })

    // Insertar médicos
    const insertMedicos = db.prepare(`
      INSERT OR IGNORE INTO medicos (usuario_id, matricula, especialidad, valor_consulta) VALUES (?, ?, ?, ?)
    `)

    const medicos = [
      [3, "MP12345", "Medicina General", 5000.0],
      [4, "MP54321", "Cardiología", 7000.0],
    ]

    medicos.forEach((medico) => {
      insertMedicos.run(...medico)
    })

    // Insertar tipos de estudios
    const insertTiposEstudios = db.prepare(`
      INSERT OR IGNORE INTO tipos_estudios (nombre, descripcion, costo, duracion_minutos, requiere_insumos) VALUES (?, ?, ?, ?, ?)
    `)

    const tiposEstudios = [
      ["Radiografía", "Radiografía simple", 3000.0, 15, 0],
      ["Tomografía Computada", "TC con o sin contraste", 12000.0, 30, 1],
      ["Resonancia Magnética", "RM con o sin contraste", 15000.0, 45, 1],
      ["Ecografía", "Ecografía general", 4000.0, 20, 1],
      ["Análisis de Sangre", "Hemograma completo", 2500.0, 10, 1],
      ["Electrocardiograma", "ECG de reposo", 2000.0, 15, 0],
      ["Mamografía", "Control mamario", 4500.0, 20, 0],
      ["Endoscopía", "Endoscopía digestiva alta", 8000.0, 30, 1],
      ["Colonoscopía", "Estudio de colon", 10000.0, 60, 1],
      ["Densitometría Ósea", "Estudio de densidad ósea", 5000.0, 25, 0],
    ]

    tiposEstudios.forEach((tipo) => {
      insertTiposEstudios.run(...tipo)
    })

    // Insertar insumos
    const insertInsumos = db.prepare(`
      INSERT OR IGNORE INTO insumos (nombre, descripcion, stock_actual, stock_minimo, unidad_medida, costo_unitario) VALUES (?, ?, ?, ?, ?, ?)
    `)

    const insumos = [
      ["Contraste Iodado", "Contraste para TC", 50, 10, "ml", 150.0],
      ["Gel Ecográfico", "Gel conductor para ecografía", 25, 5, "tubo", 300.0],
      ["Jeringas 10ml", "Jeringa descartable", 200, 50, "unidad", 25.0],
      ["Guantes Látex", "Guantes descartables", 500, 100, "par", 15.0],
      ["Gasas Estériles", "Gasas para curaciones", 100, 20, "paquete", 80.0],
    ]

    insumos.forEach((insumo) => {
      insertInsumos.run(...insumo)
    })

    // Insertar pacientes de ejemplo
    const insertPacientes = db.prepare(`
      INSERT OR IGNORE INTO pacientes (dni, nombre, apellido, fecha_nacimiento, telefono, email, obra_social, numero_afiliado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const pacientes = [
      ["12345678", "Pedro", "Martínez", "1980-05-15", "1234567890", "pedro@email.com", "OSDE", "OS123456"],
      ["87654321", "Laura", "Fernández", "1990-08-22", "0987654321", "laura@email.com", "Swiss Medical", "SM789012"],
      ["11111111", "Roberto", "López", "1975-12-10", "1111111111", "roberto@email.com", "Particular", null],
      ["22222222", "Carmen", "Ruiz", "1985-03-18", "2222222222", "carmen@email.com", "IOMA", "IO345678"],
    ]

    pacientes.forEach((paciente) => {
      insertPacientes.run(...paciente)
    })

    console.log("✅ Datos iniciales insertados exitosamente")
  } catch (error) {
    console.error("❌ Error insertando datos iniciales:", error)
  }
}
