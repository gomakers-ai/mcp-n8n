# Referencia de Nodos de n8n

Esta guía te ayudará a crear workflows con los nodos más comunes de n8n.

## Estructura de un Nodo

Cada nodo en n8n tiene esta estructura básica:

```typescript
{
  "id": "unique-id",           // Opcional, se genera automáticamente
  "name": "Node Name",         // Nombre del nodo
  "type": "n8n-nodes-base.nodeName",  // Tipo de nodo
  "position": [x, y],          // Posición en el canvas
  "parameters": {              // Parámetros específicos del nodo
    // Configuración del nodo
  },
  "credentials": {             // Credenciales (si se requieren)
    "credentialType": "credentialName"
  }
}
```

## Nodos Trigger (Disparadores)

### Manual Trigger

Trigger manual para testing:

```json
{
  "name": "When clicking 'Test workflow'",
  "type": "n8n-nodes-base.manualTrigger",
  "position": [250, 300],
  "parameters": {}
}
```

### Schedule Trigger

Ejecutar en un horario específico:

```json
{
  "name": "Every Day at 9am",
  "type": "n8n-nodes-base.scheduleTrigger",
  "position": [250, 300],
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "hours",
          "hoursInterval": 24
        }
      ],
      "triggerAtHour": 9,
      "triggerAtMinute": 0
    }
  }
}
```

### Webhook Trigger

Recibir datos vía HTTP:

```json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "position": [250, 300],
  "parameters": {
    "path": "mi-webhook",
    "httpMethod": "POST",
    "responseMode": "onReceived"
  }
}
```

### Cron Trigger

Ejecutar con expresión cron:

```json
{
  "name": "Cron",
  "type": "n8n-nodes-base.cron",
  "position": [250, 300],
  "parameters": {
    "cronExpression": "0 9 * * 1-5"  // Lunes a viernes a las 9am
  }
}
```

## Nodos de Datos

### HTTP Request

Hacer peticiones HTTP:

```json
{
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "position": [450, 300],
  "parameters": {
    "url": "https://api.example.com/data",
    "method": "GET",
    "responseFormat": "json",
    "options": {}
  }
}
```

Con autenticación:

```json
{
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "position": [450, 300],
  "parameters": {
    "url": "https://api.example.com/data",
    "method": "POST",
    "authentication": "predefinedCredentialType",
    "jsonParameters": true,
    "bodyParametersJson": "={{ $json }}"
  },
  "credentials": {
    "httpBasicAuth": "my-credentials"
  }
}
```

### Code Node (JavaScript)

Ejecutar código JavaScript personalizado:

```json
{
  "name": "Code",
  "type": "n8n-nodes-base.code",
  "position": [450, 300],
  "parameters": {
    "mode": "runOnceForAllItems",
    "jsCode": "// Tu código aquí\nreturn items.map(item => ({\n  json: {\n    ...item.json,\n    processed: true\n  }\n}));"
  }
}
```

### Set Node

Establecer o transformar datos:

```json
{
  "name": "Set",
  "type": "n8n-nodes-base.set",
  "position": [450, 300],
  "parameters": {
    "options": {},
    "values": {
      "string": [
        {
          "name": "email",
          "value": "={{ $json.user_email }}"
        }
      ],
      "number": [
        {
          "name": "count",
          "value": "={{ $json.items.length }}"
        }
      ]
    }
  }
}
```

### Function Node

Node de función para transformaciones complejas:

```json
{
  "name": "Function",
  "type": "n8n-nodes-base.function",
  "position": [450, 300],
  "parameters": {
    "functionCode": "const output = [];\nfor (const item of items) {\n  output.push({\n    json: {\n      result: item.json.value * 2\n    }\n  });\n}\nreturn output;"
  }
}
```

## Nodos de Control de Flujo

### IF Node

Dividir flujo basado en condiciones:

```json
{
  "name": "IF",
  "type": "n8n-nodes-base.if",
  "position": [450, 300],
  "parameters": {
    "conditions": {
      "string": [
        {
          "value1": "={{ $json.status }}",
          "operation": "equals",
          "value2": "active"
        }
      ]
    }
  }
}
```

### Switch Node

Dividir flujo en múltiples caminos:

```json
{
  "name": "Switch",
  "type": "n8n-nodes-base.switch",
  "position": [450, 300],
  "parameters": {
    "mode": "rules",
    "rules": {
      "rules": [
        {
          "name": "Success",
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.status }}",
                "operation": "equals",
                "value2": "success"
              }
            ]
          }
        },
        {
          "name": "Error",
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.status }}",
                "operation": "equals",
                "value2": "error"
              }
            ]
          }
        }
      ]
    }
  }
}
```

### Merge Node

Combinar datos de múltiples fuentes:

```json
{
  "name": "Merge",
  "type": "n8n-nodes-base.merge",
  "position": [650, 300],
  "parameters": {
    "mode": "combine",
    "combineBy": "combineByPosition"
  }
}
```

### Split In Batches

Procesar items en lotes:

```json
{
  "name": "Split In Batches",
  "type": "n8n-nodes-base.splitInBatches",
  "position": [450, 300],
  "parameters": {
    "batchSize": 10,
    "options": {}
  }
}
```

## Nodos de Comunicación

### Email (SMTP)

Enviar emails:

```json
{
  "name": "Send Email",
  "type": "n8n-nodes-base.emailSend",
  "position": [650, 300],
  "parameters": {
    "fromEmail": "sender@example.com",
    "toEmail": "={{ $json.email }}",
    "subject": "Your Subject",
    "text": "Email body content",
    "options": {}
  },
  "credentials": {
    "smtp": "my-smtp-credentials"
  }
}
```

### Slack

Enviar mensajes a Slack:

```json
{
  "name": "Slack",
  "type": "n8n-nodes-base.slack",
  "position": [650, 300],
  "parameters": {
    "resource": "message",
    "operation": "post",
    "channel": "#general",
    "text": "={{ $json.message }}",
    "otherOptions": {}
  },
  "credentials": {
    "slackApi": "my-slack-credentials"
  }
}
```

### Telegram

Enviar mensajes a Telegram:

```json
{
  "name": "Telegram",
  "type": "n8n-nodes-base.telegram",
  "position": [650, 300],
  "parameters": {
    "resource": "message",
    "operation": "sendMessage",
    "chatId": "={{ $json.chatId }}",
    "text": "Mensaje de notificación"
  },
  "credentials": {
    "telegramApi": "my-telegram-credentials"
  }
}
```

## Nodos de Base de Datos

### PostgreSQL

```json
{
  "name": "Postgres",
  "type": "n8n-nodes-base.postgres",
  "position": [450, 300],
  "parameters": {
    "operation": "executeQuery",
    "query": "SELECT * FROM users WHERE active = true"
  },
  "credentials": {
    "postgres": "my-postgres-credentials"
  }
}
```

### MySQL

```json
{
  "name": "MySQL",
  "type": "n8n-nodes-base.mySql",
  "position": [450, 300],
  "parameters": {
    "operation": "insert",
    "table": "users",
    "columns": "name, email, created_at"
  },
  "credentials": {
    "mySql": "my-mysql-credentials"
  }
}
```

### MongoDB

```json
{
  "name": "MongoDB",
  "type": "n8n-nodes-base.mongoDb",
  "position": [450, 300],
  "parameters": {
    "operation": "find",
    "collection": "users",
    "query": "{\"status\": \"active\"}"
  },
  "credentials": {
    "mongoDb": "my-mongodb-credentials"
  }
}
```

## Nodos de Almacenamiento

### Google Sheets

```json
{
  "name": "Google Sheets",
  "type": "n8n-nodes-base.googleSheets",
  "position": [650, 300],
  "parameters": {
    "operation": "append",
    "sheetId": "1234567890",
    "range": "Sheet1!A:Z",
    "options": {}
  },
  "credentials": {
    "googleSheetsOAuth2Api": "my-google-credentials"
  }
}
```

### Google Drive

```json
{
  "name": "Google Drive",
  "type": "n8n-nodes-base.googleDrive",
  "position": [650, 300],
  "parameters": {
    "operation": "upload",
    "name": "={{ $json.filename }}",
    "folderId": "folder-id-here"
  },
  "credentials": {
    "googleDriveOAuth2Api": "my-google-credentials"
  }
}
```

## Ejemplo de Conexiones

Las conexiones entre nodos se definen así:

```json
{
  "connections": {
    "When clicking 'Test workflow'": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request": {
      "main": [
        [
          {
            "node": "Set",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Workflow Completo de Ejemplo

```json
{
  "name": "Email Automation",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300],
      "parameters": {
        "rule": {
          "interval": [{"field": "hours", "hoursInterval": 24}],
          "triggerAtHour": 9
        }
      }
    },
    {
      "name": "Get Users",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300],
      "parameters": {
        "url": "https://api.example.com/users",
        "method": "GET"
      }
    },
    {
      "name": "Filter Active",
      "type": "n8n-nodes-base.if",
      "position": [650, 300],
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.active }}",
              "operation": "equals",
              "value2": "true"
            }
          ]
        }
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [850, 300],
      "parameters": {
        "toEmail": "={{ $json.email }}",
        "subject": "Daily Update",
        "text": "Hello {{ $json.name }}"
      },
      "credentials": {
        "smtp": "my-smtp"
      }
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [[{"node": "Get Users", "type": "main", "index": 0}]]
    },
    "Get Users": {
      "main": [[{"node": "Filter Active", "type": "main", "index": 0}]]
    },
    "Filter Active": {
      "main": [[{"node": "Send Email", "type": "main", "index": 0}]]
    }
  }
}
```

## Tips para Crear Workflows

1. **Posiciones de Nodos**: Espacía los nodos horizontalmente en incrementos de 200-250 (ej: 250, 450, 650)
2. **IDs de Nodos**: Si no especificas un ID, n8n lo generará automáticamente
3. **Nombres**: Dale nombres descriptivos a tus nodos para facilitar el debugging
4. **Credenciales**: Crea las credenciales primero antes de referenciarlas en los nodos
5. **Testing**: Usa el Manual Trigger para testing antes de configurar triggers automáticos
6. **Expresiones**: Usa `={{ }}` para expresiones dinámicas que referencien datos de nodos previos
7. **Error Handling**: Considera añadir nodos de error handling con el Error Trigger node

## Recursos Adicionales

- [Documentación oficial de nodos n8n](https://docs.n8n.io/integrations/builtin/)
- [Lista completa de nodos disponibles](https://n8n.io/integrations)
- [Plantillas de workflows](https://n8n.io/workflows)
