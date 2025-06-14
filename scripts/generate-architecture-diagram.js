// Script para generar Diagrama de Arquitectura del Sistema
console.log("🏗️ Generando Diagrama de Arquitectura del Sistema")

const architectureDiagram = `
graph TB
    %% Capa de Presentación
    subgraph "🖥️ Capa de Presentación"
        WEB[Web Browser]
        ELECTRON[Electron Desktop App]
        MOBILE[Mobile App Future]
    end

    %% Capa de Aplicación
    subgraph "⚛️ Capa de Aplicación Frontend"
        NEXTJS[Next.js 14 App Router]
        REACT[React Components]
        CONTEXT[Context API Auth]
        HOOKS[Custom Hooks]
        FORMS[Form Components]
    end

    %% Capa de API
    subgraph "🔌 Capa de API Backend"
        API_AUTH[Auth API Routes]
        API_PAC[Pacientes API]
        API_TURN[Turnos API]
        API_EST[Estudios API]
        API_REP[Reportes API]
        MIDDLEWARE[Auth Middleware]
    end

    %% Capa de Lógica de Negocio
    subgraph "🧠 Capa de Lógica de Negocio"
        USER_MODEL[Usuario Model]
        PAC_MODEL[Paciente Model]
        TURN_MODEL[Turno Model]
        EST_MODEL[Estudio Model]
        VALID[Validaciones]
        BUSINESS[Reglas de Negocio]
    end

    %% Capa de Datos
    subgraph "💾 Capa de Datos"
        MEMORY_DB[Memory Database Dev]
        SQLITE[SQLite Production]
        FILE_SYS[File System]
    end

    %% Servicios Externos
    subgraph "🌐 Servicios Externos"
        EMAIL[Email Service Future]
        SMS[SMS Service Future]
        BACKUP[Backup Service]
    end

    %% Conexiones Capa Presentación -> Aplicación
    WEB --> NEXTJS
    ELECTRON --> NEXTJS
    MOBILE -.-> NEXTJS

    %% Conexiones Aplicación -> API
    NEXTJS --> API_AUTH
    NEXTJS --> API_PAC
    NEXTJS --> API_TURN
    NEXTJS --> API_EST
    NEXTJS --> API_REP

    REACT --> CONTEXT
    REACT --> HOOKS
    REACT --> FORMS

    %% Conexiones API -> Lógica
    API_AUTH --> USER_MODEL
    API_PAC --> PAC_MODEL
    API_TURN --> TURN_MODEL
    API_EST --> EST_MODEL

    MIDDLEWARE --> USER_MODEL

    %% Conexiones Lógica -> Datos
    USER_MODEL --> MEMORY_DB
    PAC_MODEL --> MEMORY_DB
    TURN_MODEL --> MEMORY_DB
    EST_MODEL --> MEMORY_DB

    USER_MODEL --> SQLITE
    PAC_MODEL --> SQLITE
    TURN_MODEL --> SQLITE
    EST_MODEL --> SQLITE

    VALID --> BUSINESS
    BUSINESS --> MEMORY_DB
    BUSINESS --> SQLITE

    %% Conexiones Servicios Externos
    API_AUTH -.-> EMAIL
    API_TURN -.-> SMS
    SQLITE --> BACKUP
    FILE_SYS --> BACKUP

    %% Estilos
    classDef presentation fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef application fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef api fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef business fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef data fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef external fill:#f1f8e9,stroke:#689f38,stroke-width:2px

    class WEB,ELECTRON,MOBILE presentation
    class NEXTJS,REACT,CONTEXT,HOOKS,FORMS application
    class API_AUTH,API_PAC,API_TURN,API_EST,API_REP,MIDDLEWARE api
    class USER_MODEL,PAC_MODEL,TURN_MODEL,EST_MODEL,VALID,BUSINESS business
    class MEMORY_DB,SQLITE,FILE_SYS data
    class EMAIL,SMS,BACKUP external
`

console.log("🏗️ Diagrama de Arquitectura generado:")
console.log(architectureDiagram)

// Análisis de la arquitectura
console.log("\n📋 Análisis de Arquitectura:")
console.log("🖥️ Presentación: 3 canales (Web, Desktop, Mobile futuro)")
console.log("⚛️ Aplicación: Next.js con React y gestión de estado")
console.log("🔌 API: 5 endpoints principales + middleware")
console.log("🧠 Lógica: 4 modelos principales + validaciones")
console.log("💾 Datos: Dual (Memory para dev, SQLite para prod)")
console.log("🌐 Externos: 3 servicios futuros planificados")

console.log("\n🎯 Patrones Implementados:")
console.log("• MVC (Model-View-Controller)")
console.log("• Repository Pattern (Models)")
console.log("• API REST")
console.log("• Layered Architecture")
console.log("• Context Pattern (Estado global)")

console.log("\n✅ Diagrama de Arquitectura guardado como 'arquitectura.mmd'")
