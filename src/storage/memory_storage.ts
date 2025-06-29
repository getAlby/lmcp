import { IStorage } from "./storage.js";

export class MemoryStorage implements IStorage {
  private _validPaymentHashes: string[];
  constructor() {
    this._validPaymentHashes = [];
  }

  async isValid(paymentHash: string): Promise<boolean> {
    return this._validPaymentHashes.includes(paymentHash);
  }
  async setValid(paymentHash: string, valid: boolean): Promise<void> {
    this._validPaymentHashes = this._validPaymentHashes.filter(
      (h) => h !== paymentHash
    );
    if (valid) {
      this._validPaymentHashes.push(paymentHash);
    }
  }
}
