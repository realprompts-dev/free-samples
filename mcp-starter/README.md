# MCP Starter: Free Sample

This folder contains a minimal MCP server skeleton (around 120 lines of
TypeScript) that demonstrates the wiring pattern used in the paid pack.
The skeleton compiles in principle but is intentionally trivial.

## What is in the sample

`minimal-server-skeleton.ts` shows:

- stdio transport via `@modelcontextprotocol/sdk`
- one tool (`ping`) returning `pong`
- JSON-Schema input definition with bounded string length
- env-based secret read with fail-fast on missing variable
- error returns at the handler boundary, no thrown errors crossing the SDK
- strict TypeScript, no `any`, no non-null assertions

It is not a copy of any of the five paid templates.

## What is in the full pack

Five production-ready MCP server templates: Notion, Linear, Postgres,
filesystem-sandbox, and Slack. Each ships with a real API client,
manifest, env example, vitest tests, and security guards (read-only
Postgres, path-escape protection on the filesystem sandbox, secret
masking on logs). All five share the same layout so once you ship one,
the others read the same way.

Price: 9 EUR. Buy: realpromptsdev.gumroad.com/l/mcp-starter-pack

## License

The sample is CC-BY-NC 4.0. Personal and commercial use of the full pack
requires a purchase. See `../LICENSE.txt` at the repo root.
