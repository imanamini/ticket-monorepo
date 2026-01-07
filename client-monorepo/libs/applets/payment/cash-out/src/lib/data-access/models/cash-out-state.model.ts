import { StoredCard } from "./stored-card.model";

export const CASH_OUT_STORAGE_KEY = '__cashOutState'

export interface CashOutState {
    amount: number;
    walletConfig: {certFile: string, tacUrl: string, feeCharge: number } 
    card: StoredCard
  }

export type CashOutAction =
  | { type: 'UPDATE_AMOUNT'; payload: { amount: number } }
  | { type: 'UPDATE_WALLET_CONFIG'; payload: CashOutState['walletConfig'] }
  | { type: 'UPDATE_CARD_INFO'; payload: CashOutState['card'] }
  | { type: 'CLEAR_STORAGE' };


