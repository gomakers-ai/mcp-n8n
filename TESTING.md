# Testing del MCP n8n

## Pre-requisitos para Testing

Antes de probar el servidor MCP, asegúrate de tener:

1. Una instancia de n8n corriendo (self-hosted o cloud)
2. Un API key válido de n8n
3. Cursor instalado con soporte para MCP
4. Node.js 18 o superior

## Configuración Rápida para Testing

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
N8N_BASE_URL=http://localhost:5678  # o tu URL de n8n
N8N_API_KEY=tu-api-key-aqui
```

### 2. Compilar el Proyecto

```bash
npm run build
```

### 3. Probar el Servidor Localmente

Puedes probar que el servidor funcione ejecutándolo directamente:

```bash
node dist/index.js
```

El servidor debería mostrar: `n8n MCP Server running on stdio`

Presiona Ctrl+C para detener.

## Configurar en Cursor

### Opción 1: Configuración Global

Edita tu archivo de configuración MCP de Cursor:

**macOS/Linux:**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

Añade:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": [
        "/Users/leonardo/Documents/GitHub/mcp-n8n/dist/index.js"
      ],
      "env": {
        "N8N_BASE_URL": "http://localhost:5678",
        "N8N_API_KEY": "tu-api-key-aqui"
      }
    }
  }
}
```

**Importante:** Reemplaza `/Users/leonardo/Documents/GitHub/mcp-n8n/dist/index.js` con la ruta absoluta real a tu archivo.

### Opción 2: Configuración por Proyecto

Si prefieres configurarlo solo para este proyecto, crea un archivo `.cursor/mcp.json` en la raíz de tu proyecto:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "N8N_BASE_URL": "http://localhost:5678",
        "N8N_API_KEY": "tu-api-key-aqui"
      }
    }
  }
}
```

## Reiniciar Cursor

Después de configurar el MCP:

1. Cierra completamente Cursor
2. Abre Cursor de nuevo
3. El servidor MCP debería cargarse automáticamente

## Tests Básicos

Una vez configurado, prueba estos comandos en Cursor:

### Test 1: Listar Workflows

Abre el chat de Cursor y escribe:

```
Lista todos los workflows que tengo en n8n
```

Deberías ver una lista de tus workflows.

### Test 2: Crear un Workflow Simple

```
Crea un workflow simple en n8n llamado "Test MCP" con un Manual Trigger
```

### Test 3: Ver Ejecuciones

```
Muéstrame las últimas 5 ejecuciones de workflows
```

### Test 4: Listar Tags

```
Lista todos los tags disponibles en n8n
```

## Debugging

### Verificar que el MCP está cargado

En Cursor, deberías ver el servidor MCP "n8n" en la lista de herramientas disponibles.

### Logs del Servidor

Si tienes problemas, puedes añadir logging al servidor modificando el archivo `src/index.ts`:

```typescript
console.error('MCP Server started');
console.error('Config:', {
  baseUrl: N8N_BASE_URL,
  hasApiKey: !!N8N_API_KEY
});
```

Nota: Usa `console.error()` porque `console.log()` interfiere con el protocolo MCP.

### Errores Comunes

#### "N8N_BASE_URL and N8N_API_KEY environment variables are required"

**Solución:** Verifica que las variables de entorno estén configuradas correctamente en la configuración de Cursor.

#### "Error: connect ECONNREFUSED"

**Solución:** Tu instancia de n8n no está corriendo o la URL es incorrecta. Verifica:
- Que n8n esté corriendo
- Que la URL sea correcta (incluye http:// o https://)
- Que no haya firewall bloqueando la conexión

#### "Error: 401 Unauthorized"

**Solución:** Tu API key es inválido o ha expirado. Genera un nuevo API key en n8n.

#### "Unknown tool: n8n_..."

**Solución:** El servidor MCP no se cargó correctamente. Verifica:
- La ruta al archivo `dist/index.js` es correcta
- El archivo fue compilado (`npm run build`)
- Reiniciaste Cursor después de la configuración

## Testing Avanzado

### Test de Creación de Workflow Completo

```
Crea un workflow en n8n con:
1. Un Schedule Trigger que se ejecute cada hora
2. Un HTTP Request node que consulte https://api.github.com/users/octocat
3. Un Set node que extraiga el nombre y el bio
```

### Test de Monitoreo

```
Crea un reporte que muestre:
- Total de workflows activos
- Ejecuciones de las últimas 24 horas por status
- Workflows con más ejecuciones fallidas
```

### Test de Gestión

```
1. Crea un tag llamado "testing"
2. Crea un workflow simple
3. Asigna el tag al workflow
4. Lista todos los workflows con ese tag
```

## Performance Testing

Para workflows grandes o muchas operaciones:

```
Crea 5 workflows de prueba, actívalos, y luego desactívalos
```

Esto probará:
- Creación en lote
- Operaciones múltiples
- Manejo de errores

## Validación Final

Checklist de funcionalidades a probar:

- [ ] Listar workflows
- [ ] Crear workflow
- [ ] Actualizar workflow
- [ ] Activar/desactivar workflow
- [ ] Eliminar workflow
- [ ] Listar ejecuciones
- [ ] Ver detalles de ejecución
- [ ] Crear credencial
- [ ] Crear tag
- [ ] Crear variable
- [ ] Listar proyectos
- [ ] Listar usuarios

## Limpieza Después de Testing

Para limpiar los workflows de prueba creados:

```
Lista todos los workflows que contengan "test" o "MCP" en el nombre y elimínalos
```

## Reporting de Issues

Si encuentras bugs o problemas:

1. Verifica que tienes la última versión compilada (`npm run build`)
2. Verifica los logs de Cursor
3. Intenta el mismo comando directamente en la API de n8n para descartar problemas de n8n
4. Crea un issue con:
   - Comando que ejecutaste
   - Error recibido
   - Versión de n8n
   - Sistema operativo

## Tips de Testing

- Empieza con operaciones de solo lectura (list, get) antes de operaciones de escritura
- Usa un ambiente de desarrollo de n8n, no producción
- Mantén backups de workflows importantes antes de testing
- Los workflows de prueba deberían tener nombres distintivos (ej: "TEST_")
- Usa el Manual Trigger para workflows de prueba para evitar ejecuciones no deseadas
