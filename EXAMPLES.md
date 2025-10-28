# Ejemplos de Uso del MCP n8n

Este archivo contiene ejemplos prácticos de cómo usar el servidor MCP de n8n desde Cursor.

## Workflow Templates

El MCP incluye una colección de templates pre-construidos que puedes usar como punto de partida. El sistema selecciona inteligentemente el template más apropiado basado en tu descripción.

### Usar un Template Automáticamente

```
Prompt: "Crea un chatbot de WhatsApp con IA"
```

El MCP automáticamente:
1. Busca el template más apropiado (en este caso, "WhatsApp AI Response Bot")
2. Carga el workflow completo con todos sus nodos configurados
3. Lo crea en tu instancia de n8n
4. Te proporciona el URL para acceder y personalizar

### Templates Disponibles

Los templates incluyen:
- **AI/Chat**: Asistentes de IA locales con Ollama, chatbots inteligentes
- **E-commerce/Support**: Soporte automatizado para WooCommerce
- **Marketing/Social Media**: Creación de contenido multi-plataforma
- **Communication**: WhatsApp bots, SMS automation con Twilio
- **Finance**: Análisis de acciones con GPT-4 y análisis de sentimiento
- **Data Collection**: Scraping de TikTok, integración con Google Sheets

### Ejemplos de Uso de Templates

```
Prompt: "Necesito un bot que responda mensajes de WhatsApp automáticamente"
→ Crea workflow basado en template "WhatsApp AI Response Bot"

Prompt: "Quiero automatizar el soporte post-venta de mi tienda WooCommerce"
→ Crea workflow basado en template "WooCommerce AI Chatbot for Post Sales Support"

Prompt: "Necesito un asistente de IA local y privado"
→ Crea workflow basado en template "Local Ollama AI Assistant"

Prompt: "Quiero analizar acciones del mercado financiero con IA"
→ Crea workflow basado en template "Automated Stock Analysis with GPT-4"
```

## Workflows

### Crear un Workflow Simple

```
Prompt: "Crea un workflow en n8n llamado 'Test Workflow' con un nodo Manual Trigger"
```

El workflow creado incluirá:
- Un nodo Manual Trigger en la posición [250, 300]
- El workflow estará inactivo por defecto

### Crear un Workflow con Schedule

```
Prompt: "Crea un workflow que se ejecute cada día a las 9am y envíe un mensaje a Slack"
```

Esto creará un workflow con:
- Nodo Schedule configurado para ejecutarse diariamente a las 9:00
- Nodo Slack configurado para enviar mensajes

### Activar/Desactivar Workflows

```
Prompt: "Activa el workflow con ID 'abc123'"
Prompt: "Desactiva todos los workflows que contengan 'test' en el nombre"
```

### Listar Workflows

```
Prompt: "Muéstrame todos los workflows activos"
Prompt: "Lista los workflows que tengan el tag 'production'"
Prompt: "Encuentra workflows que contengan 'email' en el nombre"
```

### Actualizar un Workflow

```
Prompt: "Actualiza el workflow 'abc123' para cambiar el nombre a 'Production Email Flow'"
Prompt: "Añade un nodo HTTP Request al workflow 'abc123' que haga GET a https://api.example.com"
```

## Ejecuciones

### Monitorear Ejecuciones

```
Prompt: "Muéstrame las últimas 20 ejecuciones"
Prompt: "Lista todas las ejecuciones fallidas del workflow 'abc123'"
Prompt: "Muéstrame las ejecuciones en estado 'running'"
```

### Ver Detalles de Ejecución

```
Prompt: "Dame los detalles completos de la ejecución 'exec123' incluyendo todos los datos"
```

### Reintentar Ejecución Fallida

```
Prompt: "Reintenta la ejecución 'exec123' que falló"
```

### Limpiar Ejecuciones

```
Prompt: "Elimina todas las ejecuciones exitosas más antiguas de 30 días"
```

## Credenciales

### Crear Credenciales

```
Prompt: "Crea una credencial HTTP Basic Auth con username 'admin' y password 'secret123'"

Prompt: "Crea credenciales para Slack con el token 'xoxb-123456789'"

Prompt: "Añade credenciales de Gmail OAuth2"
```

### Ver Esquema de Credencial

```
Prompt: "Muéstrame qué campos necesito para crear una credencial de tipo 'googleSheetsOAuth2Api'"
```

### Transferir Credenciales

```
Prompt: "Transfiere la credencial 'cred123' al proyecto 'proj456'"
```

## Tags

### Organizar con Tags

```
Prompt: "Crea un tag llamado 'production'"
Prompt: "Crea tags para 'development', 'staging', y 'production'"
Prompt: "Añade el tag 'production' al workflow 'abc123'"
Prompt: "Lista todos los workflows con el tag 'production'"
```

### Gestionar Tags

```
Prompt: "Renombra el tag 'prod' a 'production'"
Prompt: "Elimina el tag 'obsolete'"
```

## Variables de Entorno

### Crear Variables

```
Prompt: "Crea una variable llamada 'API_ENDPOINT' con valor 'https://api.example.com'"
Prompt: "Añade una variable booleana 'DEBUG_MODE' con valor true"
```

### Listar y Actualizar Variables

```
Prompt: "Muéstrame todas las variables de entorno"
Prompt: "Actualiza la variable 'API_ENDPOINT' a 'https://api-v2.example.com'"
```

## Proyectos

### Gestión de Proyectos

```
Prompt: "Crea un proyecto llamado 'Marketing Automation'"
Prompt: "Lista todos los proyectos"
Prompt: "Transfiere el workflow 'abc123' al proyecto 'Marketing Automation'"
```

### Gestión de Usuarios en Proyectos

```
Prompt: "Añade el usuario 'user123' al proyecto 'proj456' con rol 'editor'"
Prompt: "Cambia el rol del usuario 'user123' en el proyecto 'proj456' a 'admin'"
Prompt: "Remueve al usuario 'user123' del proyecto 'proj456'"
```

## Usuarios

### Gestión de Usuarios (requiere permisos de owner)

```
Prompt: "Lista todos los usuarios"
Prompt: "Crea un usuario con email 'nuevo@example.com' y rol 'global:member'"
Prompt: "Cambia el rol del usuario 'user123' a 'global:admin'"
```

## Auditoría y Control de Versiones

### Generar Reportes

```
Prompt: "Genera un reporte de auditoría de seguridad"
```

### Control de Versiones

```
Prompt: "Haz pull de los cambios del repositorio remoto"
```

## Casos de Uso Complejos

### Migrar Workflows entre Proyectos

```
Prompt: "Lista todos los workflows del proyecto A que contengan 'email', y transfiérelos al proyecto B"
```

### Limpiar Ejecuciones Fallidas

```
Prompt: "Encuentra todas las ejecuciones fallidas de workflows inactivos y elimínalas"
```

### Clonar un Workflow

```
Prompt: "Obtén el workflow 'abc123', crea una copia con el nombre 'Copy of [nombre original]', y desactívalo"
```

### Monitoreo de Salud

```
Prompt: "Muéstrame un resumen de todos los workflows activos y cuántas ejecuciones fallidas tuvo cada uno en las últimas 24 horas"
```

### Configuración Rápida de Ambiente

```
Prompt: "Crea un proyecto llamado 'Desarrollo', añade las variables API_ENDPOINT y DEBUG_MODE, y crea un workflow básico de testing"
```

## Tips

### Búsqueda Avanzada

Puedes combinar múltiples filtros:
```
Prompt: "Muéstrame workflows activos del proyecto 'Marketing' que tengan el tag 'production' y que incluyan 'email' en el nombre"
```

### Operaciones en Lote

```
Prompt: "Desactiva todos los workflows que tengan 'test' en el nombre"
Prompt: "Elimina todas las ejecuciones con status 'success' del último mes"
```

### Debugging

```
Prompt: "Muéstrame el workflow 'abc123' completo con todos sus nodos y conexiones"
Prompt: "Dame los detalles de la última ejecución fallida del workflow 'abc123' con todos los datos"
```

## Creación de Workflows Complejos

### Workflow de Email Marketing

```
Prompt: "Crea un workflow de email marketing que:
1. Use un Schedule trigger para ejecutarse los lunes a las 10am
2. Consulte una API para obtener la lista de contactos
3. Filtre los contactos activos
4. Envíe un email personalizado a cada contacto
5. Registre el resultado en una Google Sheet"
```

### Workflow de Monitoreo

```
Prompt: "Crea un workflow de monitoreo que:
1. Use un Schedule trigger cada 5 minutos
2. Haga ping a varios endpoints
3. Si alguno falla, envíe una alerta a Slack
4. Registre todos los resultados en una base de datos"
```

### Workflow de Procesamiento de Datos

```
Prompt: "Crea un workflow que:
1. Use un Webhook trigger
2. Reciba datos JSON
3. Valide y transforme los datos
4. Guarde en PostgreSQL
5. Envíe confirmación por email"
```

## Integración con otros MCP

Si tienes otros servidores MCP configurados, puedes combinarlos:

```
Prompt: "Lee el archivo customers.csv, procesa los datos, y crea un workflow en n8n que envíe un email a cada cliente"
```

Esto usaría:
1. MCP de filesystem para leer el archivo
2. MCP de n8n para crear el workflow

## Notas

- Todos los IDs (workflow IDs, execution IDs, etc.) los puedes obtener listando primero los recursos
- Algunos comandos requieren permisos específicos (owner, admin, etc.)
- Los workflows complejos con muchos nodos se pueden construir incrementalmente
- Siempre verifica los resultados de las operaciones antes de proceder con operaciones en lote
