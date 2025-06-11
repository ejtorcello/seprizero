-- Insertar usuarios del sistema
INSERT INTO usuarios (username, password, nombre, apellido, email, rol) VALUES
('admin', 'admin123', 'Juan', 'Administrador', 'admin@clinica.com', 'administrador'),
('recep1', 'recep123', 'María', 'González', 'recepcion@clinica.com', 'recepcionista'),
('dr.smith', 'doc123', 'Carlos', 'Smith', 'dr.smith@clinica.com', 'medico'),
('dr.garcia', 'doc123', 'Ana', 'García', 'dr.garcia@clinica.com', 'medico'),
('tec1', 'tec123', 'Luis', 'Técnico', 'tecnico@clinica.com', 'tecnico');

-- Insertar consultorios
INSERT INTO consultorios (numero, nombre) VALUES
('101', 'Consultorio Medicina General'),
('102', 'Consultorio Cardiología'),
('103', 'Consultorio Traumatología'),
('201', 'Consultorio Ginecología'),
('202', 'Consultorio Pediatría');

-- Insertar médicos
INSERT INTO medicos (usuario_id, matricula, especialidad, valor_consulta) VALUES
(3, 'MP12345', 'Medicina General', 5000.00),
(4, 'MP54321', 'Cardiología', 7000.00);

-- Insertar tipos de estudios clínicos
INSERT INTO tipos_estudios (nombre, descripcion, costo, duracion_minutos, requiere_insumos) VALUES
('Radiografía', 'Radiografía simple', 3000.00, 15, 0),
('Tomografía Computada', 'TC con o sin contraste', 12000.00, 30, 1),
('Resonancia Magnética', 'RM con o sin contraste', 15000.00, 45, 1),
('Ecografía', 'Ecografía general', 4000.00, 20, 1),
('Análisis de Sangre', 'Hemograma completo', 2500.00, 10, 1),
('Electrocardiograma', 'ECG de reposo', 2000.00, 15, 0),
('Mamografía', 'Control mamario', 4500.00, 20, 0),
('Endoscopía', 'Endoscopía digestiva alta', 8000.00, 30, 1),
('Colonoscopía', 'Estudio de colon', 10000.00, 60, 1),
('Densitometría Ósea', 'Estudio de densidad ósea', 5000.00, 25, 0);

-- Insertar insumos
INSERT INTO insumos (nombre, descripcion, stock_actual, stock_minimo, unidad_medida, costo_unitario) VALUES
('Contraste Iodado', 'Contraste para TC', 50, 10, 'ml', 150.00),
('Gel Ecográfico', 'Gel conductor para ecografía', 25, 5, 'tubo', 300.00),
('Jeringas 10ml', 'Jeringa descartable', 200, 50, 'unidad', 25.00),
('Guantes Látex', 'Guantes descartables', 500, 100, 'par', 15.00),
('Gasas Estériles', 'Gasas para curaciones', 100, 20, 'paquete', 80.00);

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (dni, nombre, apellido, fecha_nacimiento, telefono, email, obra_social, numero_afiliado) VALUES
('12345678', 'Pedro', 'Martínez', '1980-05-15', '1234567890', 'pedro@email.com', 'OSDE', 'OS123456'),
('87654321', 'Laura', 'Fernández', '1990-08-22', '0987654321', 'laura@email.com', 'Swiss Medical', 'SM789012'),
('11111111', 'Roberto', 'López', '1975-12-10', '1111111111', 'roberto@email.com', 'Particular', NULL),
('22222222', 'Carmen', 'Ruiz', '1985-03-18', '2222222222', 'carmen@email.com', 'IOMA', 'IO345678');
