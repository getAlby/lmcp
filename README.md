# PaidMCP - Charge Bitcoin For MCP Server Tools

Receive lightning payments for each tool request, powered by [NWC](https://nwc.dev).

In a few lines of code, turn your [modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) MCP Server tool into a paid tool:

```diff
- const server = new McpServer({name: "your-mcp-server"});
+ const server = new PaidMcpServer({name: "your mcp server"}, {nwcUrl, storage});
- server.registerTool(name, config, callback);
+ server.registerPaidTool(name, config, charge, callback);
```

## Why use PaidMCP

Instead of using the [Cloudflare Stripe MCP Boilerplate](https://github.com/iannuttall/mcp-boilerplate) which is difficult to setup, high fees and chargeback risks, you can accept payments easily and instantly from anyone in the world, without fees. This is made possible by the bitcoin lightning network.

## Get started

### Install

```bash
npm install @getalby/paidmcp
```

or

```bash
yarn add @getalby/paidmcp
```

### Import and use `PaidMcpServer`

`PaidMcpServer` is a thin wrapper around the standard `McpServer` class that adds ability to create paid tools.

> This MCP requires an NWC-enabled lightning wallet to be able to charge payments. [NWC](https://nwc.dev) is an open protocol for connecting apps to lightning wallets. If you don't have a NWC-enabled lightning wallet yet, try [Alby Hub](https://albyhub.com).

```js
import { PaidMcpServer, MemoryStorage } from "@getalby/paidmcp";

// Configure your NWC URL - should be "nostr+walletconnect://..."
const nwcUrl = process.env.NWC_URL;
// Configure storage of unused paid tool requests
const storage = new MemoryStorage();
// use PaidMcpServer instead of McpServer
const server = new PaidMcpServer(
  { name: "your-mcp-server" },
  { nwcUrl, storage }
);

// for paid tools, use registerPaidTool
// it requires an additional argument before the callback
// to configure charging information based on the request
server.registerPaidTool(
  name,
  config,
  (args) => ({ satoshi: 1, description: "Paid tool usage: " + args.city }),
  callback
);
```

## Examples

- [Weather example](./examples/weather/README.md) - simple example of a paid `get_weather` tool
- [PaidMCP Boilerplate](https://github.com/getAlby/paidmcp-boilerplate) - full boilerplate repository to get you started straight away with free and paid tools

## How it works

For a simple example we have a paid weather MCP - that you can fetch the weather for a city by paying a small fee.

```json
{
  "city": "Berlin"
}
```

Some additional parameters are injected into the tool request and response. If a paid tool is requested without a payment hash, the following response will be returned:

> the required payment amount and description can be configured per-request.

```json
{
  "payment_instructions": "Payment required. Pay the payment_request and try the same request again with the payment_hash set to continue.",
  "payment_request": "lnbc...",
  "payment_hash": "2b3e38cff2ab0172d28e004931938c09a19b3e81a2054c3b46ac087ec3bc30b3"
}
```

Once the payment is made by the human or their agent (this can be done with [Alby MCP](https://github.com/getAlby/mcp)), the agent will request the same tool again, this time providing the `payment_hash` along with the request:

```json
{
  "city": "Berlin",
  "payment_hash": "2b3e38cff2ab0172d28e004931938c09a19b3e81a2054c3b46ac087ec3bc30b3"
}
```

The MCP server will then execute the actual tool callback as normal.

```json
{
  "temperature_celcius": "27.4"
}
```
