#!/usr/bin/env node
import "websocket-polyfill";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

import dotenv from "dotenv";
import express from "express";
import { createMcpServer } from "./mcp_server.js";
import { addSSEEndpoints } from "./sse.js";
import { addStreamableHttpEndpoints } from "./streamable_http.js";

// Load environment variables from .env file
dotenv.config();

class NWCServer {
  async runSTDIO() {
    try {
      const transport = new StdioServerTransport();
      const server = createMcpServer();
      await server.connect(transport);
      // console.log("Server running in STDIO mode");
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to connect to NWC wallet: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async runHTTP() {
    const app = express();

    addSSEEndpoints(app);
    addStreamableHttpEndpoints(app);

    const port = parseInt(process.env.PORT || "3000");
    app.listen(port);
    console.log("Server running in HTTP mode on port", port);
  }
}

switch (process.env.MODE || "STDIO") {
  case "HTTP":
    new NWCServer().runHTTP().catch(console.error);
    break;
  case "STDIO":
    new NWCServer().runSTDIO().catch(console.error);
    break;
  default:
    console.error("Unknown transport: " + process.env.MCP_TRANSPORT);
}
