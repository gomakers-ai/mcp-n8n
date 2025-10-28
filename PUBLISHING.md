# Guía de Publicación

Si decides publicar este paquete en npm para que otros puedan usarlo fácilmente.

## Preparación

### 1. Actualizar package.json

Añade información adicional:

```json
{
  "name": "@tu-usuario/mcp-n8n",
  "version": "1.0.0",
  "description": "MCP server for n8n API - Complete integration for workflow automation",
  "author": "Tu Nombre <tu@email.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/mcp-n8n.git"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/mcp-n8n/issues"
  },
  "homepage": "https://github.com/tu-usuario/mcp-n8n#readme",
  "keywords": [
    "mcp",
    "n8n",
    "automation",
    "workflow",
    "cursor",
    "ai",
    "model-context-protocol"
  ],
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### 2. Verificar que todo compile

```bash
npm run build
```

### 3. Crear cuenta en npm

Si no tienes cuenta:
```bash
npm adduser
```

Si ya tienes cuenta:
```bash
npm login
```

## Publicación

### 1. Verificar el paquete

```bash
npm pack --dry-run
```

Esto mostrará qué archivos se incluirán.

### 2. Publicar

```bash
npm publish --access public
```

Si usas un scope (@usuario/paquete), necesitas `--access public` la primera vez.

## Uso Después de Publicar

Los usuarios podrán instalarlo con:

```bash
npm install -g @tu-usuario/mcp-n8n
```

Y configurarlo en Cursor así:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "mcp-n8n",
      "args": [],
      "env": {
        "N8N_BASE_URL": "http://localhost:5678",
        "N8N_API_KEY": "tu-api-key"
      }
    }
  }
}
```

## Versionado

Sigue [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x) - Cambios incompatibles
- **MINOR** (x.1.x) - Nuevas funcionalidades compatibles
- **PATCH** (x.x.1) - Bug fixes

Para actualizar la versión:

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

Luego publica:

```bash
npm publish
```

## Alternativa: GitHub Packages

Si prefieres usar GitHub Packages:

### 1. Crear .npmrc

```
@tu-usuario:registry=https://npm.pkg.github.com
```

### 2. Actualizar package.json

```json
{
  "name": "@tu-usuario/mcp-n8n",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 3. Autenticar con GitHub

```bash
npm login --registry=https://npm.pkg.github.com
```

### 4. Publicar

```bash
npm publish
```

## Sin Publicar

Si prefieres no publicar, los usuarios pueden instalar directamente desde GitHub:

```bash
npm install -g github:tu-usuario/mcp-n8n
```

O usar npx:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": [
        "-y",
        "@tu-usuario/mcp-n8n"
      ],
      "env": {
        "N8N_BASE_URL": "http://localhost:5678",
        "N8N_API_KEY": "tu-api-key"
      }
    }
  }
}
```

## Checklist Pre-Publicación

- [ ] Todas las pruebas pasan
- [ ] Documentación actualizada
- [ ] CHANGELOG actualizado
- [ ] Version bumped apropiadamente
- [ ] LICENSE incluido
- [ ] README tiene instrucciones de instalación
- [ ] .gitignore está configurado correctamente
- [ ] .npmignore si es necesario
- [ ] package.json tiene toda la metadata
- [ ] Código compilado (npm run build)

## Después de Publicar

1. Crear un release en GitHub
2. Compartir en redes sociales
3. Añadir a listas de MCPs
4. Actualizar documentación si es necesario

## Recursos

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Packages](https://github.com/features/packages)
