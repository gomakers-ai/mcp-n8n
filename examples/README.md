# Workflow Templates

Esta carpeta contiene una colección de workflows pre-construidos que sirven como templates para casos de uso comunes en n8n.

## Cómo Funciona

El MCP server tiene un sistema inteligente de selección de templates que:

1. **Analiza tu solicitud**: Cuando pides crear un workflow, el sistema analiza las palabras clave en tu descripción
2. **Busca coincidencias**: Compara tu solicitud con las palabras clave, tags, casos de uso y descripciones de cada template
3. **Selecciona el mejor match**: Asigna puntuaciones y selecciona automáticamente el template más apropiado
4. **Crea el workflow**: Importa el template completo a tu instancia de n8n

## Metadata del Sistema

El archivo `templates-metadata.json` contiene información estructurada sobre cada template:

- **id**: Identificador único del template
- **file**: Nombre del archivo JSON del workflow
- **name**: Nombre descriptivo del template
- **category**: Categoría (ej: "AI/Chat", "E-commerce/Support")
- **description**: Descripción del propósito del template
- **tags**: Tags para búsqueda rápida
- **keywords**: Palabras clave que activan este template
- **useCases**: Casos de uso específicos que resuelve
- **complexity**: Nivel de complejidad (beginner, intermediate, advanced)

## Templates Disponibles

### AI/Chat
- **Local Ollama AI Assistant** (`local-ollama-assistant`): Chat assistant privado usando Ollama
- **AI Prompt Generator** (`ai-prompt-generator`): Generador de prompts optimizados para IA

### E-commerce/Support
- **WooCommerce AI Chatbot for Post Sales** (`woocommerce-chatbot-post-sales`): Bot de soporte post-venta
- **AI-Powered WooCommerce Support Agent** (`woocommerce-support-agent`): Agente inteligente de soporte

### Communication/Chat
- **WhatsApp AI Response Bot** (`whatsapp-ai-response`): Bot para responder mensajes de WhatsApp con IA
- **Customer Chat Buffer with Twilio** (`twilio-redis-chat-buffer`): Sistema de mensajería con Twilio y Redis

### Marketing/Social Media
- **Multi-Platform Social Media Creator** (`social-media-automation`): Creación de contenido para múltiples plataformas

### Data Collection
- **TikTok Influencer Scraper** (`tiktok-scraper`): Scraping de perfiles de influencers de TikTok

### Finance/Analytics
- **Automated Stock Analysis** (`stock-analysis-gpt`): Análisis automático de acciones con GPT-4

## Cómo Usar los Templates

### Método 1: Descripción Natural (Recomendado)

Simplemente describe lo que necesitas:

```
"Crea un chatbot de WhatsApp con IA"
"Necesito automatizar mi soporte de WooCommerce"
"Quiero un asistente de IA que funcione localmente"
```

El sistema encontrará automáticamente el template más apropiado.

### Método 2: Especificar Template ID

Si sabes qué template quieres:

```javascript
// Usando el MCP
n8n_create_workflow_from_template({
  templateId: "whatsapp-ai-response",
  workflowName: "Mi Bot de WhatsApp",
  activate: false
})
```

## Agregar Nuevos Templates

Para agregar un nuevo template:

1. **Exporta el workflow** desde n8n como JSON
2. **Coloca el archivo** en esta carpeta con un nombre descriptivo
3. **Actualiza `templates-metadata.json`** con la información del nuevo template:

```json
{
  "id": "mi-nuevo-template",
  "file": "100-mi-workflow.json",
  "name": "Mi Workflow Increíble",
  "category": "Categoría/Subcategoría",
  "description": "Descripción clara y concisa",
  "tags": ["tag1", "tag2", "tag3"],
  "keywords": ["palabra", "clave", "búsqueda"],
  "useCases": [
    "caso de uso 1",
    "caso de uso 2"
  ],
  "complexity": "intermediate"
}
```

4. **Recompila el MCP**: `npm run build`

## Estructura del Template JSON

Cada template debe tener la siguiente estructura:

```json
{
  "name": "Nombre del Workflow",
  "nodes": [
    {
      "parameters": { },
      "id": "unique-node-id",
      "name": "Node Name",
      "type": "n8n-nodes-base.nodeType",
      "position": [x, y],
      "typeVersion": 1
    }
  ],
  "connections": {
    "Node Name": {
      "main": [[
        {
          "node": "Next Node",
          "type": "main",
          "index": 0
        }
      ]]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Notas Importantes

- **Credenciales**: Los templates no incluyen credenciales. Los usuarios deben configurarlas después de crear el workflow
- **IDs**: Los IDs de nodos y workflows se regeneran automáticamente al crear desde template
- **Personalización**: Los templates son puntos de partida, se espera que los usuarios los personalicen
- **Documentación**: Usa Sticky Notes dentro del workflow para documentar su funcionamiento

## Contribuir

Si tienes workflows útiles que quieras compartir como templates:

1. Asegúrate de que el workflow esté bien documentado con Sticky Notes
2. Prueba que funcione correctamente
3. Exporta como JSON desde n8n
4. Agrega metadata descriptiva
5. Envía un pull request

## Mantenimiento

- Revisa periódicamente que los templates sigan funcionando con la última versión de n8n
- Actualiza las versiones de los nodos si es necesario
- Mantén la metadata actualizada con nuevas palabras clave basadas en consultas comunes
