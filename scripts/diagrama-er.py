import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Polygon
import numpy as np

# Configuración de la figura
fig, ax = plt.subplots(1, 1, figsize=(18, 14))
ax.set_xlim(0, 18)
ax.set_ylim(0, 14)
ax.axis('off')

# Título
ax.text(9, 13.5, 'Diagrama Entidad-Relación - Sistema de Gestión Clínica', 
        ha='center', va='center', fontsize=16, fontweight='bold')

# Función para dibujar entidades
def draw_entity(ax, x, y, width, height, name, attributes, color='lightblue'):
    # Rectángulo principal
    entity_box = FancyBboxPatch((x-width/2, y-height/2), width, height, 
                               boxstyle="round,pad=0.05", 
                               facecolor=color, 
                               edgecolor='black', 
                               linewidth=2)
    ax.add_patch(entity_box)
    
    # Nombre de la entidad
    ax.text(x, y+height/2-0.3, name, ha='center', va='center', 
            fontsize=10, fontweight='bold')
    
    # Línea separadora
    ax.plot([x-width/2+0.1, x+width/2-0.1], [y+height/2-0.6, y+height/2-0.6], 'k-', linewidth=1)
    
    # Atributos
    for i, attr in enumerate(attributes):
        attr_y = y + height/2 - 1 - (i * 0.3)
        if attr.startswith('*'):  # Clave primaria
            ax.text(x, attr_y, attr[1:], ha='center', va='center', 
                   fontsize=8, fontweight='bold', style='italic')
        elif attr.startswith('#'):  # Clave foránea  
            ax.text(x, attr_y, attr[1:], ha='center', va='center', 
                   fontsize=8, color='red')
        else:
            ax.text(x, attr_y, attr, ha='center', va='center', fontsize=8)

# Función para dibujar relaciones
def draw_relationship(ax, x, y, name, color='lightgreen'):
    # Rombo
    diamond = Polygon([(x, y+0.4), (x+0.8, y), (x, y-0.4), (x-0.8, y)], 
                     facecolor=color, edgecolor='black', linewidth=1)
    ax.add_patch(diamond)
    ax.text(x, y, name, ha='center', va='center', fontsize=8, fontweight='bold')

# Definir entidades principales
entities = [
    # (nombre, x, y, width, height, atributos, color)
    ("USUARIOS", 3, 11, 2.5, 2.5, ["*id", "username", "password", "nombre", "apellido", "email", "rol", "activo"], 'lightblue'),
    ("PACIENTES", 8, 11, 2.5, 2.5, ["*id", "dni", "nombre", "apellido", "fecha_nacimiento", "telefono", "email", "obra_social"], 'lightcyan'),
    ("MEDICOS", 3, 8, 2.5, 2, ["*id", "#usuario_id", "matricula", "especialidad", "valor_consulta"], 'lightgreen'),
    ("CONSULTORIOS", 13, 11, 2.5, 1.8, ["*id", "numero", "nombre", "activo"], 'lightyellow'),
    ("TURNOS", 8, 8, 3, 3, ["*id", "#paciente_id", "#medico_id", "#consultorio_id", "fecha_hora", "duracion", "estado", "modalidad_pago", "monto"], 'lightpink'),
    ("ORDENES_MEDICAS", 13, 8, 2.8, 2.5, ["*id", "#paciente_id", "#medico_id", "#turno_id", "fecha_orden", "estado", "origen"], 'lightcoral'),
    ("TIPOS_ESTUDIOS", 3, 5, 2.5, 2, ["*id", "nombre", "descripcion", "costo", "duracion", "requiere_insumos"], 'lightsteelblue'),
    ("ESTUDIOS_SOLICITADOS", 8, 5, 3.2, 2.8, ["*id", "#orden_medica_id", "#tipo_estudio_id", "fecha_programada", "fecha_realizada", "estado", "#tecnico_id", "resultado"], 'lightgoldenrodyellow'),
    ("INSUMOS", 13, 5, 2.5, 2.2, ["*id", "nombre", "descripcion", "stock_actual", "stock_minimo", "unidad_medida", "costo_unitario"], 'lightseagreen'),
    ("INSUMOS_ESTUDIOS", 13, 2.5, 2.8, 1.8, ["*id", "#estudio_id", "#insumo_id", "cantidad_utilizada", "fecha_uso"], 'lightgray'),
    ("LIQUIDACIONES", 3, 2.5, 2.8, 2, ["*id", "#medico_id", "periodo_desde", "periodo_hasta", "total_honorarios", "estado"], 'lightslategray'),
]

# Dibujar entidades
for name, x, y, width, height, attributes, color in entities:
    draw_entity(ax, x, y, width, height, name, attributes, color)

# Definir relaciones
relationships = [
    # (nombre, x, y)
    ("es_un", 3, 9.5),
    ("programa", 5.5, 8),
    ("asiste", 8, 9.5),
    ("se_realiza", 10.5, 8),
    ("genera", 10.5, 6.5),
    ("requiere", 4.5, 5),
    ("se_programa", 8, 6.5),
    ("utiliza", 10.5, 3.8),
    ("se_liquida", 3, 5.2),
]

# Dibujar relaciones
for name, x, y in relationships:
    draw_relationship(ax, x, y, name)

# Función para dibujar líneas de relación
def draw_relation_line(ax, x1, y1, x2, y2, label1="", label2="", style='-'):
    ax.plot([x1, x2], [y1, y2], 'k'+style, linewidth=1.5)
    if label1:
        ax.text(x1, y1-0.2, label1, ha='center', va='center', fontsize=7, color='blue')
    if label2:
        ax.text(x2, y2-0.2, label2, ha='center', va='center', fontsize=7, color='blue')

# Dibujar líneas de relación con cardinalidades
relations_lines = [
    # (x1, y1, x2, y2, label1, label2)
    # USUARIOS -> MEDICOS (1:1)
    (3, 10, 3, 9.5, "1", ""),
    (3, 9.5, 3, 9, "", "1"),
    
    # MEDICOS -> TURNOS (1:M)
    (4.2, 8, 5.5, 8, "1", ""),
    (5.5, 8, 6.5, 8, "", "M"),
    
    # PACIENTES -> TURNOS (1:M)  
    (8, 10, 8, 9.5, "1", ""),
    (8, 9.5, 8, 9.5, "", "M"),
    
    # CONSULTORIOS -> TURNOS (1:M)
    (11.8, 11, 10.5, 8, "1", "M"),
    
    # TURNOS -> ORDENES_MEDICAS (1:1)
    (9.5, 8, 10.5, 8, "1", ""),
    (10.5, 8, 11.2, 8, "", "1"),
    
    # ORDENES_MEDICAS -> ESTUDIOS_SOLICITADOS (1:M)
    (13, 7, 10.5, 6.5, "1", ""),
    (10.5, 6.5, 9.6, 5.8, "", "M"),
    
    # TIPOS_ESTUDIOS -> ESTUDIOS_SOLICITADOS (1:M)
    (4.2, 5, 4.5, 5, "1", ""),
    (4.5, 5, 6.4, 5, "", "M"),
    
    # ESTUDIOS_SOLICITADOS -> INSUMOS_ESTUDIOS (1:M)
    (9.6, 5, 10.5, 3.8, "1", ""),
    (10.5, 3.8, 11.4, 2.5, "", "M"),
    
    # INSUMOS -> INSUMOS_ESTUDIOS (1:M)
    (13, 4, 13, 3.4, "1", "M"),
    
    # MEDICOS -> LIQUIDACIONES (1:M)
    (3, 7, 3, 5.2, "1", ""),
    (3, 5.2, 3, 4.5, "", "M"),
]

# Dibujar todas las líneas de relación
for x1, y1, x2, y2, label1, label2 in relations_lines:
    draw_relation_line(ax, x1, y1, x2, y2, label1, label2)

# Leyenda y notas
legend_box = FancyBboxPatch((0.5, 0.5), 4, 1.5, 
                           boxstyle="round,pad=0.1", 
                           facecolor='lightyellow', 
                           edgecolor='black', 
                           linewidth=1)
ax.add_patch(legend_box)
ax.text(2.5, 1.8, 'Leyenda:', ha='center', va='center', fontsize=10, fontweight='bold')
ax.text(0.7, 1.5, '• *id: Clave Primaria', ha='left', va='center', fontsize=8, fontweight='bold')
ax.text(0.7, 1.25, '• #campo: Clave Foránea', ha='left', va='center', fontsize=8, color='red')
ax.text(0.7, 1, '• 1:1 = Relación uno a uno', ha='left', va='center', fontsize=8)
ax.text(0.7, 0.75, '• 1:M = Relación uno a muchos', ha='left', va='center', fontsize=8)

# Información del modelo
info_box = FancyBboxPatch((14, 0.5), 3.5, 1.5, 
                         boxstyle="round,pad=0.1", 
                         facecolor='lightcyan', 
                         edgecolor='blue', 
                         linewidth=1)
ax.add_patch(info_box)
ax.text(15.75, 1.8, 'Modelo de Datos:', ha='center', va='center', fontsize=10, fontweight='bold')
ax.text(14.2, 1.5, '• 11 Entidades principales', ha='left', va='center', fontsize=8)
ax.text(14.2, 1.25, '• 9 Relaciones identificadas', ha='left', va='center', fontsize=8)
ax.text(14.2, 1, '• Soporte para auditoría', ha='left', va='center', fontsize=8)
ax.text(14.2, 0.75, '• Escalabilidad horizontal', ha='left', va='center', fontsize=8)

# Restricciones y reglas de negocio
rules_box = FancyBboxPatch((5.5, 0.5), 7.5, 1.5, 
                          boxstyle="round,pad=0.1", 
                          facecolor='lightcoral', 
                          edgecolor='red', 
                          linewidth=1)
ax.add_patch(rules_box)
ax.text(9.25, 1.8, 'Reglas de Negocio Principales:', ha='center', va='center', fontsize=10, fontweight='bold')
ax.text(5.7, 1.5, '• Un médico puede tener múltiples turnos, pero un turno pertenece a un solo médico', ha='left', va='center', fontsize=8)
ax.text(5.7, 1.25, '• Un paciente puede tener múltiples turnos y órdenes médicas', ha='left', va='center', fontsize=8)
ax.text(5.7, 1, '• Los estudios requieren orden médica previa y pueden usar múltiples insumos', ha='left', va='center', fontsize=8)
ax.text(5.7, 0.75, '• Las liquidaciones se generan por médico y período específico', ha='left', va='center', fontsize=8)

plt.tight_layout()
plt.show()

print("✅ Diagrama Entidad-Relación generado exitosamente")
print("🗃️ Entidades: 11 tablas principales del sistema")
print("🔗 Relaciones: 9 relaciones con cardinalidades definidas")
print("🔑 Claves: Primarias (*) y Foráneas (#) identificadas")
print("📋 Reglas de negocio: Restricciones y validaciones incluidas")
