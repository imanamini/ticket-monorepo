export interface CreditChequeStepInterface {
  date?: number;
  iban?: string;
  amount?: number;
  chequeId?: string;
  bankName?: string;
  ownerName?: string;
  ownerNationalCode?: string;
  ownerRelative?: number;
  chequeVersion?: number;
  ownerCellNumber?: string;
  ownerBirthDate?: number;
}
