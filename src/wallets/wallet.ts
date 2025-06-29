export interface IWallet {
  requestInvoice(args: { satoshi: number; description: string }): Promise<{
    payment_request: string;
    payment_hash: string;
  }>;
  verifyPayment(paymentHash: string): Promise<boolean>;
}
