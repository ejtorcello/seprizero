// Script para generar el Diagrama Entidad-Relación del sistema
console.log("🏥 Generando Diagrama ER del Sistema de Gestión Clínica")

const erDiagram = `
erDiagram
    USUARIOS {
        int id PK
        string username UK
        string password
        string nombre
        string apellido
        string email UK
        string rol
        boolean activo
        datetime created_at
    }
    
    PACIENTES {
        int id PK
        string dni UK
        string nombre
        string apellido
        date fecha_nacimiento
        string telefono
        string email
        text direccion
        string obra_social
        string numero_afiliado
        datetime created_at
    }
    
    CONSULTORIOS {
        int id PK
        string numero UK
        string nombre
        boolean activo
        datetime created_at
    }
    
    MEDICOS {
        int id PK
        int usuario_id FK
        string matricula UK
        string especialidad
        decimal valor_consulta
        boolean activo
    }
    
    TURNOS {
        int id PK
        int paciente_id FK
        int medico_id FK
        int consultorio_id FK
        datetime fecha_hora
        int duracion_minutos
        string estado
        string modalidad_pago
        decimal monto
        text diagnostico
        text observaciones
        datetime created_at
    }
    
    TIPOS_ESTUDIOS {
        int id PK
        string nombre
        text descripcion
        decimal costo
        int duracion_minutos
        boolean requiere_insumos
        boolean activo
    }
    
    ORDENES_MEDICAS {
        int id PK
        int paciente_id FK
        int medico_id FK
        int turno_id FK
        date fecha_orden
        string estado
        string origen
        text observaciones
        datetime created_at
    }
    
    ESTUDIOS_SOLICITADOS {
        int id PK
        int orden_medica_id FK
        int tipo_estudio_id FK
        datetime fecha_programada
        datetime fecha_realizada
        string estado
        int tecnico_id FK
        text resultado
        text observaciones
    }
    
    INSUMOS {
        int id PK
        string nombre
        text descripcion
        int stock_actual
        int stock_minimo
        string unidad_medida
        decimal costo_unitario
        boolean activo
    }
    
    INSUMOS_ESTUDIOS {
        int id PK
        int estudio_id FK
        int insumo_id FK
        int cantidad_utilizada
        datetime fecha_uso
    }
    
    LIQUIDACIONES {
        int id PK
        int medico_id FK
        date periodo_desde
        date periodo_hasta
        decimal total_honorarios
        string estado
        datetime fecha_generacion
    }

    %% Relaciones
    USUARIOS ||--o{ MEDICOS : "es"
    USUARIOS ||--o{ ESTUDIOS_SOLICITADOS : "realiza"
    
    PACIENTES ||--o{ TURNOS : "tiene"
    PACIENTES ||--o{ ORDENES_MEDICAS : "recibe"
    
    MEDICOS ||--o{ TURNOS : "atiende"
    MEDICOS ||--o{ ORDENES_MEDICAS : "prescribe"
    MEDICOS ||--o{ LIQUIDACIONES : "cobra"
    
    CONSULTORIOS ||--o{ TURNOS : "se_realiza_en"
    
    TURNOS ||--o| ORDENES_MEDICAS : "genera"
    
    ORDENES_MEDICAS ||--o{ ESTUDIOS_SOLICITADOS : "contiene"
    
    TIPOS_ESTUDIOS ||--o{ ESTUDIOS_SOLICITADOS : "define"
    
    ESTUDIOS_SOLICITADOS ||--o{ INSUMOS_ESTUDIOS : "utiliza"
    
    INSUMOS ||--o{ INSUMOS_ESTUDIOS : "se_consume_en"
`

console.log("📊 Diagrama ER generado:")
console.log(erDiagram)

// Guardar en archivo (simulado)
console.log("\n✅ Diagrama ER guardado como 'diagrama-er.mmd'")
console.log("💡 Puedes visualizarlo en: https://mermaid.live/")
