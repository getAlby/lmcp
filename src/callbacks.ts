import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z, ZodRawShape } from "zod";
import { IWallet } from "./wallets/wallet.js";
import { IStorage } from "./storage/storage.js";

export type ChargeCallback<InputArgs extends ZodRawShape> = (
  params: InputArgs
) => { satoshi: number; description: string };

export function paidCallback<InputArgs extends ZodRawShape>(
  cb: ToolCallback<InputArgs>,
  charge: ChargeCallback<InputArgs>,
  wallet: IWallet,
  storage: IStorage
): (
  args: Parameters<typeof cb>[0] & { payment_hash: string },
  extra: Parameters<typeof cb>[1]
) => Promise<CallToolResult> {
  return async (args, extra): Promise<CallToolResult> => {
    if (
      !args.payment_hash ||
      !(await storage.isValid(args.payment_hash)) ||
      !(await wallet.verifyPayment(args.payment_hash))
    ) {
      const chargeArgs = await charge(args as any);

      const { payment_request, payment_hash } = await wallet.requestInvoice({
        satoshi: chargeArgs.satoshi,
        description: chargeArgs.description,
      });

      await storage.setValid(payment_hash, true);

      const result = {
        payment_instructions:
          "Payment required. Pay the payment_request and try the same request again with the payment_hash set to continue.",
        payment_request,
        payment_hash,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    }

    // only allow one request per payment
    await storage.setValid(args.payment_hash, false);

    return cb(args, extra);
  };
}
