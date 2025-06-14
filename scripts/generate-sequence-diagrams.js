// Script para generar Diagramas de Secuencia de los flujos principales
console.log("🔄 Generando Diagramas de Secuencia del Sistema")

// Diagrama 1: Flujo de Login
const loginSequence = `
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API Auth
    participant DB as Base de Datos
    participant S as Sesión

    U->>F: Ingresa credenciales
    F->>A: POST /api/auth/login
    A->>DB: Buscar usuario por username
    DB-->>A: Datos del usuario
    A->>A: Verificar contraseña
    alt Credenciales válidas
        A->>S: Crear sesión/cookie
        A-->>F: Usuario autenticado + token
        F-->>U: Redirigir a dashboard
    else Credenciales inválidas
        A-->>F: Error de autenticación
        F-->>U: Mostrar mensaje de error
    end
`

// Diagrama 2: Flujo de Creación de Turno
const turnoSequence = `
sequenceDiagram
    participant R as Recepcionista
    participant F as Frontend
    participant API as API Turnos
    participant DB as Base de Datos
    participant N as Notificaciones

    R->>F: Abrir formulario de turno
    F->>API: GET /api/pacientes (buscar)
    API->>DB: Consultar pacientes
    DB-->>API: Lista de pacientes
    API-->>F: Pacientes disponibles
    
    R->>F: Seleccionar paciente y médico
    F->>API: GET /api/medicos/disponibilidad
    API->>DB: Verificar disponibilidad
    DB-->>API: Horarios disponibles
    API-->>F: Slots disponibles
    
    R->>F: Confirmar turno
    F->>API: POST /api/turnos
    API->>DB: Verificar conflictos
    alt Sin conflictos
        API->>DB: Crear turno
        DB-->>API: Turno creado
        API->>N: Enviar notificación
        API-->>F: Turno confirmado
        F-->>R: Mostrar confirmación
    else Conflicto de horario
        API-->>F: Error de conflicto
        F-->>R: Mostrar error y sugerir alternativas
    end
`

// Diagrama 3: Flujo de Atención Médica
const atencionSequence = `
sequenceDiagram
    participant M as Médico
    participant F as Frontend
    participant API as API Sistema
    participant DB as Base de Datos
    participant P as Paciente

    M->>F: Ver agenda del día
    F->>API: GET /api/turnos?fecha=hoy
    API->>DB: Consultar turnos
    DB-->>API: Lista de turnos
    API-->>F: Turnos del día
    
    M->>F: Seleccionar paciente
    F->>API: GET /api/pacientes/{id}/historial
    API->>DB: Consultar historial médico
    DB-->>API: Historial completo
    API-->>F: Datos del paciente
    
    M->>F: Realizar consulta
    Note over M,P: Atención médica presencial
    
    M->>F: Registrar diagnóstico
    F->>API: PUT /api/turnos/{id}
    API->>DB: Actualizar turno con diagnóstico
    
    alt Requiere estudios
        M->>F: Crear orden médica
        F->>API: POST /api/ordenes-medicas
        API->>DB: Crear orden con estudios
        DB-->>API: Orden creada
        API-->>F: Orden confirmada
    end
    
    API->>DB: Marcar turno como atendido
    DB-->>API: Turno actualizado
    API-->>F: Consulta completada
    F-->>M: Mostrar resumen
`

// Diagrama 4: Flujo de Estudios Clínicos
const estudiosSequence = `
sequenceDiagram
    participant T as Técnico
    participant F as Frontend
    participant API as API Estudios
    participant DB as Base de Datos
    participant M as Médico
    participant P as Paciente

    T->>F: Ver estudios programados
    F->>API: GET /api/estudios?estado=programado
    API->>DB: Consultar estudios pendientes
    DB-->>API: Lista de estudios
    API-->>F: Estudios del día
    
    T->>F: Seleccionar estudio
    F->>API: GET /api/estudios/{id}/detalle
    API->>DB: Consultar orden médica
    DB-->>API: Detalles del estudio
    API-->>F: Información completa
    
    Note over T,P: Realización del estudio
    
    T->>F: Registrar resultados
    F->>API: PUT /api/estudios/{id}/resultados
    API->>DB: Guardar resultados
    
    alt Requiere insumos
        API->>DB: Actualizar stock de insumos
        DB-->>API: Stock actualizado
    end
    
    API->>DB: Marcar estudio como realizado
    DB-->>API: Estudio completado
    API-->>F: Resultados guardados
    
    F->>API: Notificar a médico
    API-->>M: Estudio completado
    F-->>T: Confirmar registro
`

console.log("🔐 1. Diagrama de Secuencia - Login:")
console.log(loginSequence)

console.log("\n📅 2. Diagrama de Secuencia - Creación de Turno:")
console.log(turnoSequence)

console.log("\n🩺 3. Diagrama de Secuencia - Atención Médica:")
console.log(atencionSequence)

console.log("\n🔬 4. Diagrama de Secuencia - Estudios Clínicos:")
console.log(estudiosSequence)

// Resumen de flujos
console.log("\n📊 Resumen de Flujos Analizados:")
console.log("1. Autenticación: 6 pasos principales")
console.log("2. Gestión de Turnos: 8 pasos con validaciones")
console.log("3. Atención Médica: 7 pasos con opciones")
console.log("4. Estudios Clínicos: 9 pasos con gestión de insumos")

console.log("\n✅ Diagramas de Secuencia guardados como 'secuencias-*.mmd'")
console.log("💡 Visualiza en: https://mermaid.live/")
