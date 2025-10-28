# MCP n8n Server

[![npm version](https://img.shields.io/npm/v/mcp-n8n.svg)](https://www.npmjs.com/package/mcp-n8n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![n8n](https://img.shields.io/badge/n8n-compatible-orange.svg)](https://n8n.io)

**Complete n8n API integration for Claude Desktop and Cursor** - Manage workflows, automate tasks, and control every aspect of n8n directly through AI conversations.

Transform your n8n workflow management with natural language commands. Create complex automations, monitor executions, manage credentials, and orchestrate your entire n8n infrastructure without leaving your IDE.

---

## ✨ Features

### 🔄 Workflow Management
- **Create & Deploy**: Build workflows with natural language descriptions
- **CRUD Operations**: Full lifecycle management (Create, Read, Update, Delete)
- **Activation Control**: Enable/disable workflows on demand
- **Project Transfer**: Move workflows between projects seamlessly
- **Tag Management**: Organize workflows with custom tags

### 📊 Execution Monitoring
- **Real-time Tracking**: Monitor workflow executions with advanced filters
- **Detailed Insights**: Access full execution data and logs
- **Error Recovery**: Retry failed executions automatically
- **Cleanup Tools**: Manage execution history efficiently

### 🔐 Credential Management
- **Secure Creation**: Add credentials for any service
- **Schema Discovery**: Auto-discover required fields for credential types
- **Project Isolation**: Transfer credentials between projects safely
- **Type Support**: Compatible with all n8n credential types

### 🎯 Workflow Templates
- **Pre-built Solutions**: 100 production-ready workflow templates included
- **Smart Matching**: AI automatically selects the best template for your use case
- **Categories**: E-commerce, Social Media, AI/Chat, Communication, Content, HR, Sales/CRM, Finance, Data Scraping, Monitoring, Productivity
- **Customizable**: All templates are fully customizable starting points

### 🏗️ Organization & Administration
- **Tags**: Categorize and organize resources
- **Variables**: Centralized environment variable management
- **Projects**: Multi-tenant project support
- **Users & Permissions**: Complete access control management
- **Audit Logs**: Generate security and compliance reports

---

## 🚀 Quick Start

### Installation

```bash
npm install -g mcp-n8n
```

### Configuration

1. **Get your n8n API credentials**:
   - Navigate to your n8n instance → Settings → n8n API
   - Generate a new API key

2. **Configure Claude Desktop**:

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "mcp-n8n",
      "env": {
        "N8N_BASE_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

3. **Configure Cursor**:

Add to Cursor MCP settings:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["/path/to/mcp-n8n/dist/index.js"],
      "env": {
        "N8N_BASE_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

4. **Restart Claude Desktop or Cursor**

---

## 💬 Usage Examples

Once configured, interact with n8n using natural language:

### Creating Workflows

```plaintext
"Create a workflow that monitors my Gmail inbox and sends
Slack notifications for important emails"
```

```plaintext
"Build a daily report workflow that pulls data from my database,
generates charts, and emails them to my team"
```

### Using Templates

```plaintext
"I need a WhatsApp chatbot with AI for customer support"
→ Automatically creates workflow from "WhatsApp AI Response Bot" template
```

```plaintext
"Create an automated stock analysis workflow"
→ Uses "Automated Stock Analysis with GPT-4" template
```

### Managing Workflows

```plaintext
"Show me all active workflows in the production project"
```

```plaintext
"Deactivate the 'Daily Backup' workflow"
```

```plaintext
"What went wrong with execution abc123?"
```

### Monitoring & Debugging

```plaintext
"Show me the last 10 failed executions"
```

```plaintext
"Retry all failed executions from workflow xyz456"
```

```plaintext
"Delete all successful executions older than 30 days"
```

---

## 🛠️ Available Tools

<details>
<summary><strong>Workflows (10 tools)</strong></summary>

- `n8n_create_workflow` - Create new workflows
- `n8n_list_workflows` - List with filters (active, tags, name, project)
- `n8n_get_workflow` - Get detailed workflow information
- `n8n_update_workflow` - Modify existing workflows
- `n8n_delete_workflow` - Remove workflows permanently
- `n8n_activate_workflow` - Enable workflow execution
- `n8n_deactivate_workflow` - Pause workflow execution
- `n8n_transfer_workflow` - Move between projects
- `n8n_get_workflow_tags` - View workflow tags
- `n8n_update_workflow_tags` - Modify workflow tags

</details>

<details>
<summary><strong>Workflow Templates (3 tools)</strong></summary>

- `n8n_list_workflow_templates` - Browse available templates
- `n8n_get_workflow_template` - View template details
- `n8n_create_workflow_from_template` - Create from template

**100 Included Templates across 13 categories**:
- E-commerce: Shopify automation, WooCommerce support agents
- Social Media: Instagram, TikTok, LinkedIn, Twitter automation
- AI/Chat: Chatbots, AI agents, voice assistants
- Communication: WhatsApp, Telegram, Email automation
- Content: Blog automation, video generation, SEO optimization
- HR/Recruitment: Resume screening, candidate sourcing
- Sales/CRM: Lead generation, cold calling pipelines
- Finance: Stock analysis, invoice extraction
- Data Scraping: Google Maps, LinkedIn, Amazon, TikTok
- Monitoring: Website uptime, competitor tracking
- Productivity: Calendar, Notion, scheduling automation

</details>

<details>
<summary><strong>Executions (4 tools)</strong></summary>

- `n8n_list_executions` - Filter by status, workflow, project
- `n8n_get_execution` - Detailed execution data
- `n8n_delete_execution` - Remove execution records
- `n8n_retry_execution` - Retry failed executions

</details>

<details>
<summary><strong>Credentials (4 tools)</strong></summary>

- `n8n_create_credential` - Add new credentials
- `n8n_delete_credential` - Remove credentials (owner only)
- `n8n_get_credential_schema` - Discover required fields
- `n8n_transfer_credential` - Move between projects

</details>

<details>
<summary><strong>Organization (19 tools)</strong></summary>

**Tags**: Create, list, get, update, delete
**Variables**: Create, list, update, delete
**Users**: List, create, get, delete, change role
**Projects**: Create, list, update, delete, manage users

</details>

<details>
<summary><strong>Advanced (2 tools)</strong></summary>

- `n8n_generate_audit` - Security audit reports
- `n8n_pull_source_control` - Version control integration

</details>

**Total: 41 tools** for complete n8n management

---

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Examples & Use Cases](EXAMPLES.md)** - Real-world automation examples
- **[Node Reference](NODE_REFERENCE.md)** - Detailed tool documentation
- **[Changelog](CHANGELOG.md)** - Version history and updates

---

## 🏗️ Project Structure

```
mcp-n8n/
├── src/
│   ├── index.ts          # MCP server implementation
│   ├── n8n-client.ts     # n8n API client
│   └── types.ts          # TypeScript definitions
├── examples/
│   ├── templates-metadata.json
│   └── *.json            # Pre-built workflow templates
├── dist/                 # Compiled output
├── QUICKSTART.md         # Quick start guide
├── EXAMPLES.md           # Usage examples
├── NODE_REFERENCE.md     # API documentation
└── package.json
```

---

## 🔧 Development

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/mcp-n8n.git
cd mcp-n8n

# Install dependencies
npm install

# Build
npm run build

# Development with auto-rebuild
npm run watch
```

### Local Testing

```bash
# Set environment variables
cp .env.example .env
# Edit .env with your credentials

# Build and test
npm run build
node dist/index.js
```

---

## 📋 Requirements

- **Node.js**: 18 or higher
- **n8n Instance**: Self-hosted or n8n Cloud (paid plan)
- **n8n API Key**: Required for authentication
- **AI IDE**: Claude Desktop or Cursor with MCP support

### n8n Requirements

- **Self-hosted**: Full API access ✅
- **n8n Cloud**: Requires paid plan for API access
- **Version**: Compatible with n8n v1.0.0+

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[n8n](https://n8n.io)** - The workflow automation platform
- **[Anthropic](https://anthropic.com)** - Claude and Model Context Protocol
- **[Cursor](https://cursor.sh)** - AI-powered code editor

---

## 🔗 Resources

- [n8n API Documentation](https://docs.n8n.io/api/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [n8n Community](https://community.n8n.io/)
- [MCP Servers Registry](https://github.com/modelcontextprotocol/servers)

---

## ⚠️ Important Notes

### API Access
- n8n Cloud requires a **paid plan** to access the API
- Self-hosted n8n has **full API access** on all plans
- Some operations require **owner/admin permissions**

### Security
- Never commit `.env` files with credentials
- Use environment variables for sensitive data
- API keys grant full access to your n8n instance
- Regularly rotate API keys for security

### Rate Limiting
- Respect n8n API rate limits
- Use pagination for large result sets
- Implement error handling for rate limit responses

---

## 🐛 Troubleshooting

### Connection Issues

**Problem**: "Cannot connect to n8n API"
- Verify `N8N_BASE_URL` is correct and accessible
- Check that API key is valid
- Ensure n8n instance is running

### Permission Errors

**Problem**: "Insufficient permissions"
- Some operations require owner/admin role
- Verify your user has appropriate permissions
- Check project-level access rights

### Template Issues

**Problem**: "Template not found"
- Ensure `examples/` directory is present
- Verify `templates-metadata.json` exists
- Check template file references are correct

---

## 💡 Tips & Best Practices

1. **Start with Templates**: Use pre-built templates as starting points
2. **Use Tags**: Organize workflows with tags for easy management
3. **Monitor Executions**: Regularly check failed executions
4. **Clean Up**: Remove old execution data to save space
5. **Version Control**: Use n8n's built-in version control features
6. **Test First**: Test workflows before activating in production

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/gomakers-ai/mcp-n8n/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gomakers-ai/mcp-n8n/discussions)
- **n8n Community**: [community.n8n.io](https://community.n8n.io/)

---

<div align="center">

**[⬆ Back to Top](#mcp-n8n-server)**

Made with ❤️ by [GoMakers.ai](https://gomakers.ai)

</div>
