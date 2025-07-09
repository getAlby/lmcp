# Weather MCP Server

An example paid MCP server

This MCP server uses the [official MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Quick Start

> In case you get stuck, see troubleshooting section below.

### Use the Alby-Hosted MCP Server

If your agent supports remote MCP servers - SSE (e.g. N8N) or HTTP Streamable transports, you can connect to Alby's MCP server.

- SSE: `https://weather-mcp.fly.dev/sse`
- HTTP Streamable: `https://weather-mcp.fly.dev/mcp`

## From Source

### Prerequisites

- Node.js 20+
- Yarn
- A connection string from a lightning wallet that supports NWC

### Installation

```bash
yarn install
```

### Building

```bash
yarn build
```

### Add your NWC connection

Copy `.env.example` to `.env` and update your NWC connection secret

### Inspect the tools (use/test without an LLM)

`yarn inspect`

### Supported Tools

See the [tools directory](./src/tools)

## Troubleshooting

### Model Usage

Make sure you use a decent model (e.g. Claude Sonnet 3.7) otherwise the MCP server will not work.

### Contact Alby Support

Visit [support.getalby.com](https://support.getalby.com) and we're happy to help you get the MCP server working.
