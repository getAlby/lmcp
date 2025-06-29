import { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import {
  McpServer,
  RegisteredTool,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  Implementation,
  ToolAnnotations,
} from "@modelcontextprotocol/sdk/types.js";
import "websocket-polyfill";
import { NWCWallet } from "./wallets/nwc_wallet.js";
import { IWallet } from "./wallets/wallet.js";
import { ZodRawShape } from "zod";
import { paidConfig } from "./schema.js";
import { ChargeCallback, paidCallback } from "./callbacks.js";
import { IStorage } from "./storage/storage.js";
import { MemoryStorage } from "./storage/memory_storage.js";

export class PaidMcpServer extends McpServer {
  private _wallet: IWallet;
  private _storage: IStorage;

  constructor(
    serverInfo: Implementation,
    /**
     * @property nwcUrl the connection secret for your wallet - ideally receive-only
     * @property storage configure storage for paid, unused tool access (default: in-memory)
     */
    paidArgs: { nwcUrl: string; storage?: IStorage },
    options?: ServerOptions
  ) {
    super(serverInfo, options);
    this._wallet = new NWCWallet(paidArgs.nwcUrl);
    this._storage = paidArgs.storage || new MemoryStorage();
  }

  /**
   * Registers a paid tool with a config object, charge callback and tool callback.
   *
   * @param charge configure how much to charge based on the request
   */
  registerPaidTool<
    InputArgs extends ZodRawShape,
    OutputArgs extends ZodRawShape
  >(
    name: string,
    config: {
      title?: string;
      description?: string;
      inputSchema?: InputArgs;
      outputSchema?: OutputArgs;
      annotations?: ToolAnnotations;
    },
    charge: ChargeCallback<InputArgs>,
    cb: ToolCallback<InputArgs>
  ): RegisteredTool {
    return this.registerTool(
      name,
      paidConfig(config),
      paidCallback(cb, charge, this._wallet, this._storage) as any
    );
  }
}
