# Quick Start Guide - MCP n8n

¡Comienza a usar el MCP de n8n en 5 minutos!

## Paso 1: Obtener tu API Key de n8n

### Si usas n8n self-hosted:

1. Abre tu instancia de n8n (ejemplo: http://localhost:5678)
2. Ve a **Settings** (Configuración)
3. Selecciona **n8n API**
4. Haz clic en **Generate new API key** o copia una existente
5. Guarda tu API key en un lugar seguro

### Si usas n8n Cloud:

1. Ve a https://app.n8n.cloud
2. Ve a **Settings** > **API**
3. Asegúrate de tener un **plan de pago** (la API no está disponible en el plan gratuito)
4. Genera o copia tu API key

## Paso 2: Instalar Dependencias

```bash
cd /Users/leonardo/Documents/GitHub/mcp-n8n
npm install
```

## Paso 3: Compilar el Proyecto

```bash
npm run build
```

Deberías ver: "npm run build" ejecutarse sin errores.

## Paso 4: Configurar en Cursor

### Encontrar tu archivo de configuración de Cursor:

**macOS:**
```bash
open ~/Library/Application\ Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/
```

**Linux:**
```bash
xdg-open ~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/
```

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\
```

### Editar cline_mcp_settings.json:

Si el archivo no existe, créalo. Añade o modifica para incluir:

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
        "N8N_API_KEY": "n8n_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

**Importante:**
- Reemplaza la ruta con tu ruta absoluta real
- Reemplaza `N8N_BASE_URL` con la URL de tu instancia
- Reemplaza `N8N_API_KEY` con tu API key real

### Obtener la ruta absoluta:

```bash
cd /Users/leonardo/Documents/GitHub/mcp-n8n
pwd
# Copia el resultado y añade /dist/index.js al final
```

## Paso 5: Reiniciar Cursor

1. **Cierra completamente Cursor** (no solo la ventana)
   - macOS: Cmd+Q
   - Windows/Linux: File > Exit
2. **Abre Cursor de nuevo**
3. Espera unos segundos para que cargue el MCP

## Paso 6: Verificar que Funciona

Abre el chat de Claude en Cursor y escribe:

```
Lista todos los workflows que tengo en n8n
```

Si funciona, deberías ver una lista de tus workflows (o un array vacío si no tienes ninguno).

## Paso 7: ¡Crear tu Primer Workflow!

Prueba este comando:

```
Crea un workflow en n8n llamado "Mi Primer Workflow MCP" con un Manual Trigger
```

¡Felicidades! Ya tienes el MCP de n8n funcionando.

## Comandos de Prueba Rápida

Prueba estos comandos para familiarizarte:

### Ver workflows
```
Muéstrame todos los workflows
```

### Ver ejecuciones recientes
```
Muéstrame las últimas 10 ejecuciones
```

### Crear un tag
```
Crea un tag llamado "mcp-testing"
```

### Ver variables de entorno
```
Lista todas las variables de entorno en n8n
```

### Ver proyectos
```
Muéstrame todos los proyectos
```

## Troubleshooting Rápido

### "N8N_BASE_URL and N8N_API_KEY environment variables are required"

**Problema:** Las variables de entorno no están configuradas.

**Solución:**
1. Verifica que editaste el archivo correcto de Cursor
2. Asegúrate de que la sintaxis JSON sea correcta
3. Reinicia Cursor completamente

### "Error: connect ECONNREFUSED"

**Problema:** No se puede conectar a n8n.

**Solución:**
1. Verifica que n8n esté corriendo: abre la URL en tu navegador
2. Verifica que la URL en la config sea correcta (incluye http:// o https://)
3. Si usas localhost, prueba con 127.0.0.1

### "Error: 401 Unauthorized"

**Problema:** API key inválido.

**Solución:**
1. Verifica que copiaste el API key completo
2. Genera un nuevo API key en n8n
3. Actualiza la configuración y reinicia Cursor

### No veo el servidor MCP cargado

**Solución:**
1. Verifica que el archivo `dist/index.js` existe
2. Ejecuta `npm run build` de nuevo
3. Verifica que la ruta en la configuración sea absoluta (no relativa)
4. Comprueba los logs de Cursor: View > Toggle Developer Tools > Console

### El servidor se carga pero no funciona

**Solución:**
1. Verifica la conexión a n8n manualmente:
```bash
curl -H "X-N8N-API-KEY: tu-api-key" http://localhost:5678/api/v1/workflows
```
2. Si el curl funciona, el problema es con el MCP
3. Si el curl no funciona, el problema es con n8n o tu API key

## Próximos Pasos

1. Lee [EXAMPLES.md](./EXAMPLES.md) para ver ejemplos de uso avanzados
2. Consulta [NODE_REFERENCE.md](./NODE_REFERENCE.md) para aprender sobre nodos de n8n
3. Lee el [README.md](./README.md) para documentación completa

## Necesitas Ayuda?

- Revisa [TESTING.md](./TESTING.md) para debugging detallado
- Consulta la [documentación oficial de n8n](https://docs.n8n.io/api/)
- Verifica la [documentación de MCP](https://modelcontextprotocol.io/)

## ¡Disfruta!

Ahora puedes gestionar todos tus workflows de n8n directamente desde Cursor. ¡Happy coding!
