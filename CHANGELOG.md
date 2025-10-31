# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-31

### Added - Token Optimization Features 🎯

#### Major Performance Improvements
- **New `n8n_list_workflows_summary` endpoint** - Returns only essential fields (id, name, active, tags, updatedAt, createdAt), reducing token consumption by ~90%
- **Field filtering support** - Both `n8n_list_workflows` and `n8n_list_executions` now accept a `fields` parameter to request only specific fields
- **Smart default limits** - Reduced from 100 to 10-20 results to minimize token usage while maintaining usability
- **Token optimization documentation** - New `TOKEN_OPTIMIZATION.md` with comprehensive usage guide

#### API Enhancements
- Added `fields` parameter to `getWorkflows()` method in n8n-client
- Added `fields` parameter to `getExecutions()` method in n8n-client
- Client-side field filtering for workflows and executions
- Updated tool descriptions with token usage warnings

### Changed
- `n8n_list_workflows` default limit: 100 → 10
- `n8n_list_executions` default limit: 100 → 20
- `n8n_list_workflows` description now includes warning about token usage
- `n8n_list_executions` includes warning about `includeData` parameter impact
- README updated with token optimization section
- Tool count updated: Workflows now shows 11 tools (added summary endpoint)

### Performance Impact
- **Before**: ~50,000 tokens for listing 100 workflows
- **After**: ~500 tokens for listing 20 workflows with summary endpoint
- **Result**: 97% reduction in typical token usage

### Documentation
- Added TOKEN_OPTIMIZATION.md with best practices
- Updated README with token optimization highlights
- Added usage examples showing token-efficient patterns
- Migration guide for existing users

## [1.0.0] - 2025-10-27

### Added

#### Workflow Management
- `n8n_create_workflow` - Create new workflows with nodes, connections, and settings
- `n8n_list_workflows` - List all workflows with advanced filtering
- `n8n_get_workflow` - Get detailed workflow information
- `n8n_update_workflow` - Update existing workflows
- `n8n_delete_workflow` - Delete workflows
- `n8n_activate_workflow` - Activate workflows
- `n8n_deactivate_workflow` - Deactivate workflows
- `n8n_transfer_workflow` - Transfer workflows between projects
- `n8n_get_workflow_tags` - Get workflow tags
- `n8n_update_workflow_tags` - Update workflow tags

#### Execution Management
- `n8n_list_executions` - List executions with filtering by status, workflow, project
- `n8n_get_execution` - Get detailed execution information
- `n8n_delete_execution` - Delete execution records
- `n8n_retry_execution` - Retry failed executions

#### Credentials Management
- `n8n_create_credential` - Create credentials for node types
- `n8n_delete_credential` - Delete credentials
- `n8n_get_credential_schema` - Get credential type schema
- `n8n_transfer_credential` - Transfer credentials between projects

#### Tags Management
- `n8n_create_tag` - Create new tags
- `n8n_list_tags` - List all tags
- `n8n_get_tag` - Get specific tag information
- `n8n_update_tag` - Update tag names
- `n8n_delete_tag` - Delete tags

#### Variables Management
- `n8n_create_variable` - Create environment variables
- `n8n_list_variables` - List all variables
- `n8n_update_variable` - Update variable values
- `n8n_delete_variable` - Delete variables

#### User Management
- `n8n_list_users` - List all users (owner only)
- `n8n_create_users` - Create multiple users
- `n8n_get_user` - Get user information
- `n8n_delete_user` - Delete users
- `n8n_change_user_role` - Change user global roles

#### Project Management
- `n8n_create_project` - Create new projects
- `n8n_list_projects` - List all projects
- `n8n_update_project` - Update project information
- `n8n_delete_project` - Delete projects
- `n8n_add_user_to_project` - Add users to projects
- `n8n_remove_user_from_project` - Remove users from projects
- `n8n_change_user_project_role` - Change user roles in projects

#### Other Features
- `n8n_generate_audit` - Generate security audit reports
- `n8n_pull_source_control` - Pull from source control

### Documentation
- Comprehensive README with installation and usage instructions
- EXAMPLES.md with practical usage examples
- NODE_REFERENCE.md with n8n node types reference
- TESTING.md with testing and debugging guide
- Configuration examples for Cursor integration

### Technical
- Full TypeScript implementation
- Axios-based HTTP client with error handling
- Zod schemas for validation
- MCP SDK integration
- Comprehensive type definitions

## [Unreleased]

### Planned Features
- Resource templates (common workflow patterns)
- Batch operations helper functions
- Workflow validation tools
- Enhanced error reporting
- Workflow import/export utilities
- Execution statistics aggregation
- Webhook testing helpers
- Node parameter validation

### Improvements Under Consideration
- Add caching for frequently accessed resources
- Implement rate limiting handling
- Add retry logic for failed API calls
- Support for webhook URLs generation
- Workflow diff/comparison tools
- Interactive workflow builder prompts
- Integration with n8n community nodes

## Version History

- **1.0.0** - Initial release with full n8n API coverage
