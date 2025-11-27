#!/usr/bin/env node

/**
 * GitHub Integration MCP Server
 * Provides tools for interacting with GitHub API (PRs, issues, commits)
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class GitHubMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'github-integration',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_pr_info',
          description: 'Get information about a pull request',
          inputSchema: {
            type: 'object',
            properties: {
              owner: {
                type: 'string',
                description: 'Repository owner',
              },
              repo: {
                type: 'string',
                description: 'Repository name',
              },
              pr_number: {
                type: 'number',
                description: 'Pull request number',
              },
            },
            required: ['owner', 'repo', 'pr_number'],
          },
        },
        {
          name: 'list_pr_files',
          description: 'List files changed in a pull request',
          inputSchema: {
            type: 'object',
            properties: {
              owner: {
                type: 'string',
                description: 'Repository owner',
              },
              repo: {
                type: 'string',
                description: 'Repository name',
              },
              pr_number: {
                type: 'number',
                description: 'Pull request number',
              },
            },
            required: ['owner', 'repo', 'pr_number'],
          },
        },
        {
          name: 'get_commit_info',
          description: 'Get information about a specific commit',
          inputSchema: {
            type: 'object',
            properties: {
              owner: {
                type: 'string',
                description: 'Repository owner',
              },
              repo: {
                type: 'string',
                description: 'Repository name',
              },
              sha: {
                type: 'string',
                description: 'Commit SHA',
              },
            },
            required: ['owner', 'repo', 'sha'],
          },
        },
        {
          name: 'create_pr_comment',
          description: 'Add a comment to a pull request',
          inputSchema: {
            type: 'object',
            properties: {
              owner: {
                type: 'string',
                description: 'Repository owner',
              },
              repo: {
                type: 'string',
                description: 'Repository name',
              },
              pr_number: {
                type: 'number',
                description: 'Pull request number',
              },
              body: {
                type: 'string',
                description: 'Comment body (supports Markdown)',
              },
            },
            required: ['owner', 'repo', 'pr_number', 'body'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_pr_info':
            return await this.getPRInfo(args);
          case 'list_pr_files':
            return await this.listPRFiles(args);
          case 'get_commit_info':
            return await this.getCommitInfo(args);
          case 'create_pr_comment':
            return await this.createPRComment(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async getPRInfo(args) {
    const { owner, repo, pr_number } = args;

    // Use GitHub CLI if available, otherwise return error message
    try {
      const { execSync } = require('child_process');
      const result = execSync(
        `gh pr view ${pr_number} --repo ${owner}/${repo} --json title,body,author,state,createdAt,updatedAt,additions,deletions,changedFiles`,
        { encoding: 'utf-8' }
      );

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: GitHub CLI (gh) is not available, not authenticated, or you lack permissions. Please install and authenticate the GitHub CLI: https://cli.github.com/`,
          },
        ],
        isError: true,
      };
    }
  }

  async listPRFiles(args) {
    const { owner, repo, pr_number } = args;

    try {
      const { execSync } = require('child_process');
      const result = execSync(
        `gh pr view ${pr_number} --repo ${owner}/${repo} --json files`,
        { encoding: 'utf-8' }
      );

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: GitHub CLI (gh) is not available, not authenticated, or you lack permissions. Please install and authenticate the GitHub CLI: https://cli.github.com/`,
          },
        ],
        isError: true,
      };
    }
  }

  async getCommitInfo(args) {
    const { owner, repo, sha } = args;

    try {
      const { execSync } = require('child_process');
      const result = execSync(
        `gh api repos/${owner}/${repo}/commits/${sha}`,
        { encoding: 'utf-8' }
      );

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: GitHub CLI (gh) is not available, not authenticated, or you lack permissions. Please install and authenticate the GitHub CLI: https://cli.github.com/`,
          },
        ],
        isError: true,
      };
    }
  }

  async createPRComment(args) {
    const { owner, repo, pr_number, body } = args;

    try {
      const { execSync } = require('child_process');
      execSync(
        `gh pr comment ${pr_number} --repo ${owner}/${repo} --body "${body.replace(/"/g, '\\"')}"`,
        { encoding: 'utf-8' }
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success: true, message: 'Comment added successfully' }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: GitHub CLI (gh) is not available, not authenticated, or you lack permissions. Please install and authenticate the GitHub CLI: https://cli.github.com/`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub Integration MCP server running on stdio');
  }
}

const server = new GitHubMCPServer();
server.run().catch(console.error);
