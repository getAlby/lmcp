import { LN, nwc } from "@getalby/sdk";
import { IWallet } from "./wallet.js";

export class NWCWallet implements IWallet {
  private _nwcUrl: string;
  constructor(nwcUrl: string) {
    this._nwcUrl = nwcUrl;
  }
  async verifyPayment(paymentHash: string): Promise<boolean> {
    const nwcClient = new nwc.NWCClient({
      nostrWalletConnectUrl: this._nwcUrl,
    });
    const transaction = await nwcClient.lookupInvoice({
      payment_hash: paymentHash,
    });

    nwcClient.close();

    return !!transaction.settled_at;
  }

  async requestInvoice(args: { satoshi: number; description: string }) {
    const ln = new LN(this._nwcUrl);
    const paymentRequest = await ln.requestPayment(
      { satoshi: args.satoshi },
      {
        description: args.description,
      }
    );
    ln.close();

    return {
      payment_hash: paymentRequest.invoice.paymentHash,
      payment_request: paymentRequest.invoice.paymentRequest,
    };
  }
}
