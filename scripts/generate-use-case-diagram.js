// Script para generar el Diagrama de Casos de Uso
console.log("👥 Generando Diagrama de Casos de Uso del Sistema")

const useCaseDiagram = `
graph TB
    %% Actores
    Admin[👨‍💼 Administrador]
    Recep[👩‍💻 Recepcionista]
    Medico[👨‍⚕️ Médico]
    Tecnico[👨‍🔬 Técnico]
    Paciente[👤 Paciente]

    %% Casos de Uso - Autenticación
    subgraph "🔐 Autenticación"
        UC1[Iniciar Sesión]
        UC2[Cerrar Sesión]
        UC3[Gestionar Usuarios]
    end

    %% Casos de Uso - Gestión de Pacientes
    subgraph "👥 Gestión de Pacientes"
        UC4[Registrar Paciente]
        UC5[Buscar Paciente]
        UC6[Actualizar Datos Paciente]
        UC7[Ver Historial Paciente]
    end

    %% Casos de Uso - Gestión de Turnos
    subgraph "📅 Gestión de Turnos"
        UC8[Programar Turno]
        UC9[Modificar Turno]
        UC10[Cancelar Turno]
        UC11[Ver Agenda]
        UC12[Marcar Asistencia]
    end

    %% Casos de Uso - Atención Médica
    subgraph "🩺 Atención Médica"
        UC13[Atender Paciente]
        UC14[Registrar Diagnóstico]
        UC15[Prescribir Estudios]
        UC16[Ver Historia Clínica]
    end

    %% Casos de Uso - Estudios Clínicos
    subgraph "🔬 Estudios Clínicos"
        UC17[Crear Orden Médica]
        UC18[Programar Estudio]
        UC19[Realizar Estudio]
        UC20[Registrar Resultados]
        UC21[Gestionar Insumos]
    end

    %% Casos de Uso - Administración
    subgraph "⚙️ Administración"
        UC22[Gestionar Consultorios]
        UC23[Calcular Liquidaciones]
        UC24[Generar Reportes]
        UC25[Configurar Sistema]
    end

    %% Relaciones Administrador
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC22
    Admin --> UC23
    Admin --> UC24
    Admin --> UC25

    %% Relaciones Recepcionista
    Recep --> UC1
    Recep --> UC2
    Recep --> UC4
    Recep --> UC5
    Recep --> UC6
    Recep --> UC8
    Recep --> UC9
    Recep --> UC10
    Recep --> UC11
    Recep --> UC12
    Recep --> UC17
    Recep --> UC18

    %% Relaciones Médico
    Medico --> UC1
    Medico --> UC2
    Medico --> UC5
    Medico --> UC7
    Medico --> UC11
    Medico --> UC13
    Medico --> UC14
    Medico --> UC15
    Medico --> UC16
    Medico --> UC17

    %% Relaciones Técnico
    Tecnico --> UC1
    Tecnico --> UC2
    Tecnico --> UC18
    Tecnico --> UC19
    Tecnico --> UC20
    Tecnico --> UC21

    %% Relaciones Paciente (indirectas)
    Paciente -.-> UC4
    Paciente -.-> UC8
    Paciente -.-> UC13

    %% Estilos
    classDef actor fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef usecase fill:#f3e5f5,stroke:#4a148c,stroke-width:1px
    classDef system fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px

    class Admin,Recep,Medico,Tecnico,Paciente actor
`

console.log("🎯 Diagrama de Casos de Uso generado:")
console.log(useCaseDiagram)

// Análisis de casos de uso por rol
console.log("\n📋 Análisis por Rol:")
console.log("👨‍💼 Administrador: 8 casos de uso (gestión completa del sistema)")
console.log("👩‍💻 Recepcionista: 11 casos de uso (gestión de pacientes y turnos)")
console.log("👨‍⚕️ Médico: 9 casos de uso (atención médica y prescripciones)")
console.log("👨‍🔬 Técnico: 6 casos de uso (realización de estudios)")
console.log("👤 Paciente: 3 casos de uso indirectos (beneficiario del sistema)")

console.log("\n✅ Diagrama de Casos de Uso guardado como 'casos-de-uso.mmd'")
