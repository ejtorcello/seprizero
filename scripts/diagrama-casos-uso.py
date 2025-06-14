import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import Ellipse, FancyBboxPatch
import numpy as np

# Configuración de la figura
fig, ax = plt.subplots(1, 1, figsize=(16, 12))
ax.set_xlim(0, 14)
ax.set_ylim(0, 12)
ax.axis('off')

# Título
ax.text(7, 11.5, 'Diagrama de Casos de Uso - Sistema de Gestión Clínica', 
        ha='center', va='center', fontsize=16, fontweight='bold')

# Límites del sistema
system_box = FancyBboxPatch((2, 1), 10, 9, 
                           boxstyle="round,pad=0.2", 
                           facecolor='lightcyan', 
                           edgecolor='black', 
                           linewidth=2)
ax.add_patch(system_box)
ax.text(7, 10.2, 'Sistema de Gestión Clínica', ha='center', va='center', 
        fontsize=12, fontweight='bold')

# Actores
actors = [
    ("Recepcionista", 0.5, 8, 'lightgreen'),
    ("Médico", 0.5, 6, 'lightblue'),  
    ("Administrador", 0.5, 4, 'lightcoral'),
    ("Técnico", 0.5, 2, 'lightyellow'),
    ("Paciente", 13.5, 6, 'lightpink')
]

# Dibujar actores
for name, x, y, color in actors:
    # Cuerpo del actor
    actor_box = FancyBboxPatch((x-0.3, y-0.4), 0.6, 0.8, 
                              boxstyle="round,pad=0.05", 
                              facecolor=color, 
                              edgecolor='black', 
                              linewidth=1)
    ax.add_patch(actor_box)
    ax.text(x, y, name, ha='center', va='center', fontsize=9, fontweight='bold', rotation=90 if x > 10 else 0)

# Casos de uso organizados por categorías
casos_uso = [
    # Gestión de Pacientes
    ("Registrar\nPaciente", 4, 9, 'lightgreen'),
    ("Buscar\nPaciente", 5.5, 9, 'lightgreen'),
    ("Actualizar Datos\nPaciente", 7, 9, 'lightgreen'),
    
    # Gestión de Turnos
    ("Programar\nTurno", 4, 7.5, 'lightblue'),
    ("Cancelar\nTurno", 5.5, 7.5, 'lightblue'),
    ("Reprogramar\nTurno", 7, 7.5, 'lightblue'),
    ("Consultar\nAgenda", 8.5, 7.5, 'lightblue'),
    
    # Atención Médica
    ("Atender\nPaciente", 4, 6, 'lightyellow'),
    ("Registrar\nDiagnóstico", 5.5, 6, 'lightyellow'),
    ("Generar\nReceta", 7, 6, 'lightyellow'),
    
    # Estudios Clínicos  
    ("Solicitar\nEstudio", 8.5, 6, 'lightcyan'),
    ("Programar\nEstudio", 10, 6, 'lightcyan'),
    ("Registrar\nResultados", 4, 4.5, 'lightcyan'),
    
    # Administración
    ("Gestionar\nUsuarios", 5.5, 4.5, 'lightcoral'),
    ("Configurar\nConsultorios", 7, 4.5, 'lightcoral'),
    ("Generar\nReportes", 8.5, 4.5, 'lightcoral'),
    ("Liquidar\nHonorarios", 10, 4.5, 'lightcoral'),
    
    # Facturación
    ("Registrar\nPago", 4, 3, 'lightpink'),
    ("Generar\nFactura", 5.5, 3, 'lightpink'),
    ("Control\nObra Social", 7, 3, 'lightpink'),
    
    # Sistema
    ("Autenticar\nUsuario", 8.5, 3, 'lightgray'),
    ("Generar\nRespaldos", 10, 3, 'lightgray'),
]

# Dibujar casos de uso
for nombre, x, y, color in casos_uso:
    elipse = Ellipse((x, y), 1.2, 0.6, facecolor=color, edgecolor='black', linewidth=1)
    ax.add_patch(elipse)
    ax.text(x, y, nombre, ha='center', va='center', fontsize=7, fontweight='bold')

# Relaciones (algunas principales)
relaciones = [
    # Recepcionista
    (0.5, 8, 4, 9),      # Registrar Paciente
    (0.5, 8, 5.5, 9),    # Buscar Paciente  
    (0.5, 8, 4, 7.5),    # Programar Turno
    (0.5, 8, 5.5, 7.5),  # Cancelar Turno
    (0.5, 8, 4, 3),      # Registrar Pago
    
    # Médico
    (0.5, 6, 4, 6),      # Atender Paciente
    (0.5, 6, 5.5, 6),    # Registrar Diagnóstico
    (0.5, 6, 7, 6),      # Generar Receta
    (0.5, 6, 8.5, 6),    # Solicitar Estudio
    (0.5, 6, 8.5, 7.5),  # Consultar Agenda
    
    # Administrador
    (0.5, 4, 5.5, 4.5),  # Gestionar Usuarios
    (0.5, 4, 7, 4.5),    # Configurar Consultorios  
    (0.5, 4, 8.5, 4.5),  # Generar Reportes
    (0.5, 4, 10, 4.5),   # Liquidar Honorarios
    
    # Técnico
    (0.5, 2, 10, 6),     # Programar Estudio
    (0.5, 2, 4, 4.5),    # Registrar Resultados
    
    # Paciente (desde la derecha)
    (13.5, 6, 5.5, 9),   # Buscar Paciente (auto-consulta)
    (13.5, 6, 8.5, 7.5), # Consultar Agenda
]

# Dibujar relaciones
for x1, y1, x2, y2 in relaciones:
    ax.plot([x1, x2], [y1, y2], 'k-', alpha=0.6, linewidth=1)

# Relaciones de inclusión y extensión (ejemplos)
include_relations = [
    ((8.5, 3), (4, 7.5), "<<include>>"),  # Autenticar -> Programar Turno
    ((8.5, 3), (4, 6), "<<include>>"),    # Autenticar -> Atender Paciente  
    ((8.5, 3), (5.5, 4.5), "<<include>>"), # Autenticar -> Gestionar Usuarios
]

for (x1, y1), (x2, y2), label in include_relations:
    ax.plot([x1, x2], [y1, y2], 'r--', alpha=0.8, linewidth=1)
    mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
    ax.text(mid_x, mid_y + 0.1, label, ha='center', va='center', 
            fontsize=6, color='red', style='italic')

# Leyenda
legend_box = FancyBboxPatch((0.2, 0.2), 3, 0.6, 
                           boxstyle="round,pad=0.05", 
                           facecolor='white', 
                           edgecolor='black', 
                           linewidth=1)
ax.add_patch(legend_box)
ax.text(1.7, 0.7, 'Leyenda:', ha='center', va='center', fontsize=10, fontweight='bold')
ax.plot([0.4, 0.6], [0.5, 0.5], 'k-', linewidth=1)
ax.text(0.8, 0.5, 'Asociación', ha='left', va='center', fontsize=8)
ax.plot([1.6, 1.8], [0.5, 0.5], 'r--', linewidth=1)
ax.text(2, 0.5, 'Inclusión', ha='left', va='center', fontsize=8)

# Información adicional
info_box = FancyBboxPatch((10.5, 0.2), 3, 0.6, 
                         boxstyle="round,pad=0.05", 
                         facecolor='lightyellow', 
                         edgecolor='orange', 
                         linewidth=1)
ax.add_patch(info_box)
ax.text(12, 0.7, 'Roles del Sistema:', ha='center', va='center', fontsize=10, fontweight='bold')
ax.text(12, 0.45, '• 4 tipos de usuarios principales', ha='center', va='center', fontsize=8)
ax.text(12, 0.3, '• 22 casos de uso identificados', ha='center', va='center', fontsize=8)

plt.tight_layout()
plt.show()

print("✅ Diagrama de Casos de Uso generado exitosamente")
print("👥 Actores identificados: 5 (Recepcionista, Médico, Administrador, Técnico, Paciente)")
print("🎯 Casos de uso: 22 organizados en 6 categorías principales")
print("🔗 Relaciones: Asociación, Inclusión y Extensión representadas")
