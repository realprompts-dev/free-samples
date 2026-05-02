#!/usr/bin/env node
// Free skeleton from realprompts.
// The MCP Server Starter Pack ships 5 production-grade templates (Notion, Linear, Postgres, FS-sandbox, Slack) with tests, validation, and security baked in.
// Buy the pack: realpromptsdev.gumroad.com/l/mcp-starter-pack
//
// Minimal MCP server: stdio transport, one "ping" tool, JSON-Schema
// input validation, env-based secret read, error returns over throws.
// The paid templates add real API clients, tests, retry handling, and
// per-tool security guards.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const SERVER_NAME = "mcp-minimal-skeleton";
const SERVER_VERSION = "0.1.0";

interface ToolContent {
  type: "text";
  text: string;
}

interface ToolResult {
  content: ToolContent[];
  isError?: boolean;
}

interface PingArgs {
  message?: string;
}

interface ServerEnv {
  apiToken: string;
}

function readEnv(): ServerEnv {
  const apiToken = process.env["EXAMPLE_API_TOKEN"];
  if (apiToken === undefined || apiToken.trim() === "") {
    process.stderr.write(
      `[${SERVER_NAME}] missing required env var EXAMPLE_API_TOKEN.\n`,
    );
    process.exit(1);
  }
  return { apiToken };
}

const pingDefinition = {
  name: "ping",
  description: "Returns 'pong'. Optionally echoes a short message.",
  inputSchema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        maxLength: 200,
        description: "Optional message to echo back, capped at 200 chars.",
      },
    },
    additionalProperties: false,
  },
} as const;

function isPingArgs(value: unknown): value is PingArgs {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (
    candidate["message"] !== undefined &&
    typeof candidate["message"] !== "string"
  ) {
    return false;
  }
  return true;
}

async function handlePing(args: unknown): Promise<ToolResult> {
  if (!isPingArgs(args)) {
    return {
      isError: true,
      content: [{ type: "text", text: "ping: invalid arguments shape." }],
    };
  }
  const suffix =
    args.message !== undefined && args.message.length > 0
      ? `: ${args.message}`
      : "";
  return { content: [{ type: "text", text: `pong${suffix}` }] };
}

async function main(): Promise<void> {
  readEnv();

  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [pingDefinition],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "ping") {
      return handlePing(request.params.arguments ?? {});
    }
    return {
      isError: true,
      content: [
        { type: "text", text: `Unknown tool: ${request.params.name}` },
      ],
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`[${SERVER_NAME}] ready (stdio)\n`);
}

main().catch((err: unknown) => {
  const message =
    err instanceof Error ? (err.stack ?? err.message) : String(err);
  process.stderr.write(`[${SERVER_NAME}] fatal: ${message}\n`);
  process.exit(1);
});
