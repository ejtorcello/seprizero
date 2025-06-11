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
