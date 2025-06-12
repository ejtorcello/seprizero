# SEPRICE - Sistema de Gestión Médica

SEPRICE es un sistema integral para la gestión de centros médicos y diagnósticos, que permite administrar pacientes, turnos y estudios clínicos.

## Requisitos previos

- Node.js 18 o superior
- npm 8 o superior

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

\`\`\`bash
npm install
\`\`\`

## Desarrollo

### Aplicación web

Para ejecutar la aplicación web en modo desarrollo:

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Aplicación de escritorio (Electron)

Para ejecutar la aplicación de escritorio en modo desarrollo:

\`\`\`bash
npm run electron:dev
\`\`\`

## Construcción

### Aplicación web

Para construir la aplicación web:

\`\`\`bash
npm run build
\`\`\`

### Aplicación de escritorio (Electron)

Para construir la aplicación de escritorio:

\`\`\`bash
npm run electron:build
\`\`\`

Esto generará los archivos ejecutables en la carpeta `release`.

## Estructura del proyecto

- `/app`: Páginas y rutas de la aplicación Next.js
- `/components`: Componentes React reutilizables
- `/contexts`: Contextos de React (AuthContext, etc.)
- `/lib`: Utilidades, modelos y funciones auxiliares
- `/public`: Archivos estáticos
- `/electron`: Archivos específicos de Electron

## Usuarios de prueba

- **Administrador**: admin / admin123
- **Recepcionista**: recep1 / recep123
- **Médico**: dr.smith / doc123
- **Técnico**: tec1 / tec123
\`\`\`

Ahora, vamos a crear un archivo .gitignore para excluir archivos innecesarios:

```text file=".gitignore"
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist
/release

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# electron
/dist
/release
