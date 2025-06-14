import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np

# Configuración de la figura
fig, ax = plt.subplots(1, 1, figsize=(16, 12))
ax.set_xlim(0, 10)
ax.set_ylim(0, 16)
ax.axis('off')

# Título
ax.text(5, 15.5, 'Diagrama de Secuencias - Sistema de Gestión Clínica', 
        ha='center', va='center', fontsize=16, fontweight='bold')
ax.text(5, 15, 'Caso: Programar Turno Médico', 
        ha='center', va='center', fontsize=12, fontweight='bold', color='blue')

# Actores y objetos
actors = [
    ('Recepcionista', 1),
    ('Sistema Web', 3),
    ('Base de Datos', 5),
    ('API Backend', 7),
    ('Validador', 9)
]

# Dibujar cabeceras de actores
for name, x in actors:
    # Caja del actor
    box = FancyBboxPatch((x-0.4, 13.5), 0.8, 1, 
                         boxstyle="round,pad=0.05", 
                         facecolor='lightblue', 
                         edgecolor='black', 
                         linewidth=1)
    ax.add_patch(box)
    ax.text(x, 14, name, ha='center', va='center', fontsize=9, fontweight='bold')
    
    # Línea de vida
    ax.plot([x, x], [13.5, 1], 'k--', alpha=0.5, linewidth=1)

# Mensajes del diagrama de secuencia
messages = [
    (1, 3, 12.5, "1: Acceder al formulario de turnos", 'right'),
    (3, 1, 12, "2: Mostrar formulario con pacientes y médicos", 'left'),
    (1, 3, 11.5, "3: Completar datos del turno", 'right'),
    (3, 7, 11, "4: POST /api/turnos", 'right'),
    (7, 9, 10.5, "5: Validar datos del turno", 'right'),
    (9, 7, 10, "6: Datos válidos", 'left'),
    (7, 5, 9.5, "7: INSERT INTO turnos", 'right'),
    (5, 7, 9, "8: Turno creado (ID)", 'left'),
    (7, 3, 8.5, "9: Respuesta exitosa (201)", 'left'),
    (3, 1, 8, "10: Confirmar turno programado", 'left'),
    (1, 3, 7.5, "11: Solicitar comprobante", 'right'),
    (3, 7, 7, "12: Generar comprobante PDF", 'right'),
    (7, 3, 6.5, "13: Comprobante generado", 'left'),
    (3, 1, 6, "14: Mostrar/descargar comprobante", 'left'),
]

# Dibujar mensajes
for x1, x2, y, message, direction in messages:
    if direction == 'right':
        ax.annotate('', xy=(x2-0.1, y), xytext=(x1+0.1, y),
                   arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
        ax.text((x1+x2)/2, y+0.15, message, ha='center', va='bottom', fontsize=8)
    else:
        ax.annotate('', xy=(x2+0.1, y), xytext=(x1-0.1, y),
                   arrowprops=dict(arrowstyle='->', color='blue', lw=1.5))
        ax.text((x1+x2)/2, y+0.15, message, ha='center', va='bottom', fontsize=8)

# Rectángulos de activación
activation_bars = [
    (1, 12.5, 5.5),  # Recepcionista
    (3, 12, 6),      # Sistema Web
    (7, 11, 3.5),    # API Backend
    (9, 10.5, 0.5),  # Validador
    (5, 9.5, 0.5),   # Base de Datos
]

for x, y_start, height in activation_bars:
    rect = patches.Rectangle((x-0.05, y_start-height), 0.1, height, 
                           linewidth=1, edgecolor='black', facecolor='yellow', alpha=0.7)
    ax.add_patch(rect)

# Notas adicionales
note_box = FancyBboxPatch((0.5, 3.5), 4, 1.5, 
                         boxstyle="round,pad=0.1", 
                         facecolor='lightyellow', 
                         edgecolor='orange', 
                         linewidth=1)
ax.add_patch(note_box)
ax.text(2.5, 4.7, 'Notas:', ha='center', va='top', fontsize=10, fontweight='bold')
ax.text(2.5, 4.4, '• El sistema valida disponibilidad del médico', ha='center', va='top', fontsize=8)
ax.text(2.5, 4.1, '• Se verifica que no haya conflictos de horario', ha='center', va='top', fontsize=8)
ax.text(2.5, 3.8, '• El comprobante incluye código QR', ha='center', va='top', fontsize=8)

# Casos alternativos
alt_box = FancyBboxPatch((5.5, 3.5), 4, 1.5, 
                        boxstyle="round,pad=0.1", 
                        facecolor='lightcoral', 
                        edgecolor='red', 
                        linewidth=1)
ax.add_patch(alt_box)
ax.text(7.5, 4.7, 'Flujos Alternativos:', ha='center', va='top', fontsize=10, fontweight='bold', color='darkred')
ax.text(7.5, 4.4, '• Si hay conflicto: mostrar horarios disponibles', ha='center', va='top', fontsize=8)
ax.text(7.5, 4.1, '• Si faltan datos: solicitar información faltante', ha='center', va='top', fontsize=8)
ax.text(7.5, 3.8, '• Si error del sistema: mostrar mensaje de error', ha='center', va='top', fontsize=8)

plt.tight_layout()
plt.show()

print("✅ Diagrama de Secuencias generado exitosamente")
print("📋 Flujo principal: Programación de turno médico")
print("🔄 Actores: Recepcionista, Sistema Web, API Backend, Base de Datos, Validador")
