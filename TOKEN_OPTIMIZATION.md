# Token Optimization Guide

This MCP server has been optimized to minimize token consumption when interacting with Claude and other LLMs.

## Problem

The original implementation could consume 50,000+ tokens in a single query when listing workflows, because it returned complete workflow data including all nodes, connections, and settings.

## Solutions Implemented

### 1. **New Summary Endpoint** ⭐ RECOMMENDED

Use `n8n_list_workflows_summary` instead of `n8n_list_workflows` for browsing:

```json
{
  "name": "n8n_list_workflows_summary",
  "arguments": {
    "active": true,
    "limit": 20
  }
}
```

**Benefits:**
- Returns only: `id`, `name`, `active`, `tags`, `updatedAt`, `createdAt`
- **~90% reduction in tokens** compared to full workflow data
- Perfect for listing and browsing workflows
- When you need full details, use `n8n_get_workflow` with the specific ID

### 2. **Field Filtering**

Specify exactly which fields you need:

```json
{
  "name": "n8n_list_workflows",
  "arguments": {
    "fields": ["id", "name", "active"],
    "limit": 10
  }
}
```

**Benefits:**
- Only returns the fields you specify
- Flexible - request different fields based on your needs
- Works with both workflows and executions

### 3. **Reduced Default Limits**

| Endpoint | Old Default | New Default | Savings |
|----------|-------------|-------------|---------|
| `n8n_list_workflows` | 100 | 10 | 90% |
| `n8n_list_workflows_summary` | N/A | 20 | N/A |
| `n8n_list_executions` | 100 | 20 | 80% |

**Tip:** You can still increase the limit when needed, but defaults are now token-conscious.

### 4. **Execution Data Warning**

The `includeData` parameter now defaults to `false` and includes a warning:

```json
{
  "name": "n8n_list_executions",
  "arguments": {
    "includeData": false,  // ← Default, don't change unless needed
    "fields": ["id", "status", "workflowId"],
    "limit": 20
  }
}
```

**Benefits:**
- Execution data can be massive (10,000+ tokens per execution)
- Only include it when you actually need to inspect the execution details

## Token Consumption Examples

### Before Optimization:
```
User: "List my workflows"
→ Returns: 100 workflows × 500 tokens avg = 50,000 tokens
→ Claude processes and responds: +5,000 tokens
→ Total: ~55,000 tokens
```

### After Optimization (using summary):
```
User: "List my workflows"
→ Returns: 20 workflows × 25 tokens avg = 500 tokens
→ Claude processes and responds: +1,000 tokens
→ Total: ~1,500 tokens
```

**Result: 97% reduction in token usage** 🎯

## Best Practices

1. **Start with summaries**: Use `n8n_list_workflows_summary` for browsing
2. **Fetch details only when needed**: Use `n8n_get_workflow(id)` for specific workflows
3. **Use field filtering**: Specify `fields` parameter to get only what you need
4. **Keep limits reasonable**: Start with 10-20 results, paginate if needed
5. **Avoid includeData**: Only use for executions when you need to debug

## Migration Guide

### Old Way (Token-Heavy):
```typescript
// ❌ Consumes 50,000+ tokens
await mcp.call('n8n_list_workflows', { limit: 100 })
```

### New Way (Token-Efficient):
```typescript
// ✅ Consumes ~500 tokens
await mcp.call('n8n_list_workflows_summary', { limit: 20 })

// Then get details only for workflows you care about:
await mcp.call('n8n_get_workflow', { id: 'abc123' })
```

### Using Field Filtering:
```typescript
// ✅ Get only what you need
await mcp.call('n8n_list_workflows', {
  fields: ['id', 'name', 'active'],
  limit: 10
})
```

## Impact on Your Usage

If you were hitting token limits frequently:
- **Before**: ~10-20 queries per day before hitting limits
- **After**: ~200+ queries per day with same token budget

## Questions?

Open an issue at: https://github.com/yourusername/mcp-n8n/issues
