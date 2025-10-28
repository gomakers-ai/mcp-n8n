# Estructura del Proyecto MCP n8n

```
mcp-n8n/
│
├── src/                          # Código fuente TypeScript
│   ├── index.ts                  # Servidor MCP principal
│   │                             # - Configuración del servidor
│   │                             # - Definición de 41 herramientas MCP
│   │                             # - Handlers para todas las operaciones
│   │
│   ├── n8n-client.ts            # Cliente HTTP para n8n API
│   │                             # - Wrapper de Axios
│   │                             # - Métodos para todos los endpoints
│   │                             # - Manejo de errores
│   │
│   └── types.ts                 # Definiciones de tipos TypeScript
│                                 # - Interfaces para configuración
│                                 # - Tipos para workflows, nodos, etc.
│                                 # - Tipos de respuestas de API
│
├── dist/                        # Código compilado (JavaScript)
│   ├── index.js                 # Servidor compilado
│   ├── n8n-client.js           # Cliente compilado
│   ├── types.js                # Tipos compilados
│   └── *.d.ts                  # Archivos de declaración
│
├── node_modules/                # Dependencias npm
│
├── Documentación/               # Archivos de documentación
│   ├── README.md                # Documentación principal
│   │                             # - Instalación y configuración
│   │                             # - Lista completa de herramientas
│   │                             # - Guía de uso
│   │
│   ├── QUICKSTART.md            # Guía de inicio rápido
│   │                             # - Setup en 5 minutos
│   │                             # - Configuración paso a paso
│   │                             # - Troubleshooting básico
│   │
│   ├── EXAMPLES.md              # Ejemplos prácticos de uso
│   │                             # - Casos de uso comunes
│   │                             # - Comandos de ejemplo
│   │                             # - Operaciones complejas
│   │
│   ├── NODE_REFERENCE.md        # Referencia de nodos n8n
│   │                             # - Estructura de nodos
│   │                             # - Ejemplos de nodos comunes
│   │                             # - Workflows completos
│   │
│   ├── TESTING.md               # Guía de testing y debugging
│   │                             # - Tests básicos y avanzados
│   │                             # - Debugging detallado
│   │                             # - Solución de problemas
│   │
│   └── CHANGELOG.md             # Historial de cambios
│                                 # - Versiones y features
│                                 # - Mejoras planificadas
│
├── Configuración/               # Archivos de configuración
│   ├── package.json             # Configuración npm
│   │                             # - Dependencias
│   │                             # - Scripts (build, watch)
│   │                             # - Metadata del proyecto
│   │
│   ├── tsconfig.json            # Configuración TypeScript
│   │                             # - Opciones del compilador
│   │                             # - Paths y módulos
│   │
│   ├── .env.example             # Ejemplo de variables de entorno
│   │                             # - N8N_BASE_URL
│   │                             # - N8N_API_KEY
│   │
│   ├── cursor-config-example.json # Configuración para Cursor
│   │                             # - Ejemplo de config MCP
│   │
│   └── .gitignore               # Archivos ignorados por git
│                                 # - node_modules, dist, .env, etc.
│
└── LICENSE                      # Licencia MIT
```

## Flujo de Datos

```
┌─────────────┐
│   Cursor    │  Usuario escribe comando
│    (IDE)    │  "Crea un workflow..."
└──────┬──────┘
       │
       │ MCP Protocol
       ▼
┌─────────────────┐
│  MCP Server     │  Recibe y parsea request
│  (src/index.ts) │  Identifica herramienta
└────────┬────────┘
         │
         │ Llama método
         ▼
┌──────────────────┐
│   N8n Client     │  Prepara HTTP request
│(src/n8n-client.ts)│  Añade autenticación
└────────┬─────────┘
         │
         │ HTTP Request
         ▼
┌──────────────────┐
│   n8n API        │  Procesa operación
│  /api/v1/...    │  Ejecuta en n8n
└────────┬─────────┘
         │
         │ HTTP Response
         ▼
┌──────────────────┐
│   N8n Client     │  Maneja respuesta
│                  │  Formatea resultado
└────────┬─────────┘
         │
         │ Retorna datos
         ▼
┌─────────────────┐
│  MCP Server     │  Envía respuesta MCP
│                 │  
└────────┬────────┘
         │
         │ MCP Protocol
         ▼
┌─────────────┐
│   Cursor    │  Muestra resultado
│             │  al usuario
└─────────────┘
```

## Componentes Principales

### 1. Servidor MCP (src/index.ts)

**Responsabilidades:**
- Inicializar servidor MCP
- Registrar herramientas disponibles
- Recibir y enrutar requests
- Manejar errores globales
- Validar variables de entorno

**Herramientas Registradas:** 41 tools
- 10 Workflow tools
- 4 Execution tools
- 4 Credential tools
- 5 Tag tools
- 4 Variable tools
- 5 User tools
- 7 Project tools
- 2 Other tools

### 2. Cliente n8n (src/n8n-client.ts)

**Responsabilidades:**
- Gestionar conexión HTTP con n8n
- Autenticación con API key
- Métodos para cada endpoint de API
- Manejo de errores HTTP
- Formateo de requests/responses

**Endpoints Cubiertos:**
- `/workflows` - CRUD completo
- `/executions` - Monitoreo y retry
- `/credentials` - Gestión segura
- `/tags` - Organización
- `/variables` - Configuración
- `/users` - Administración
- `/projects` - Multi-tenancy
- `/audit` - Seguridad
- `/source-control` - Versionado

### 3. Tipos (src/types.ts)

**Definiciones:**
- `N8nConfig` - Configuración del cliente
- `WorkflowData` - Estructura de workflows
- `WorkflowNode` - Nodos individuales
- `ExecutionFilters` - Filtros de búsqueda
- `CredentialData` - Credenciales
- `ApiResponse<T>` - Respuestas tipadas

## Dependencias

### Principales
- `@modelcontextprotocol/sdk` - SDK para MCP
- `axios` - Cliente HTTP
- `zod` - Validación de esquemas

### Development
- `typescript` - Compilador TS
- `@types/node` - Tipos para Node.js

## Scripts

- `npm install` - Instalar dependencias
- `npm run build` - Compilar TypeScript a JavaScript
- `npm run watch` - Compilar en modo watch (desarrollo)
- `npm run prepare` - Hook pre-instalación (ejecuta build)

## Variables de Entorno

### Requeridas
- `N8N_BASE_URL` - URL de la instancia n8n (ej: http://localhost:5678)
- `N8N_API_KEY` - API key válido de n8n

### Uso
Las variables se configuran en el archivo de configuración de Cursor bajo la sección `env`.

## Archivos Generados

### Durante Compilación
- `dist/*.js` - Código JavaScript compilado
- `dist/*.d.ts` - Archivos de declaración TypeScript
- `dist/*.map` - Source maps para debugging

### Durante Desarrollo
- `node_modules/` - Dependencias instaladas
- `package-lock.json` - Lock file de npm

## Puntos de Extensión

Para añadir nuevas funcionalidades:

1. **Nuevo endpoint de n8n:**
   - Añadir método en `src/n8n-client.ts`
   - Añadir tipos necesarios en `src/types.ts`
   - Registrar herramienta en `src/index.ts` (ListToolsRequestSchema)
   - Añadir handler en `src/index.ts` (CallToolRequestSchema)

2. **Mejoras al cliente:**
   - Modificar `src/n8n-client.ts`
   - Añadir lógica de retry, caching, etc.

3. **Validaciones adicionales:**
   - Usar Zod en `src/index.ts`
   - Añadir schemas en la sección de tool schemas

## Testing

Para probar el servidor:

```bash
# Compilar
npm run build

# Verificar que compila sin errores
echo $?  # Debe ser 0

# Probar ejecución directa
node dist/index.js
# Debe mostrar: "n8n MCP Server running on stdio"

# Configurar en Cursor y probar
# Ver QUICKSTART.md
```

## Mantenimiento

### Actualizar dependencias
```bash
npm outdated
npm update
npm run build
```

### Verificar tipos
```bash
npx tsc --noEmit
```

### Linting (si se añade)
```bash
npm install -D eslint
npx eslint src/
```

## Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa cambios
4. Ejecuta `npm run build` para verificar
5. Actualiza documentación relevante
6. Crea pull request

## Licencia

MIT - Ver archivo LICENSE para detalles completos.
