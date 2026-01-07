import { StepKind } from './step.model';

export const StepCodes: { [key: number]: string } = {
  1: 'INIT',
  2: 'REGISTER',
  3: 'DIGIPAY_SCORE',
  4: 'BANK_SCORE',
  5: 'PROFILE',
  6: 'UPLOAD',
  7: 'WALLET_ACTIVATION',
  8: 'CHEQUE',
  9: 'CLOSE',
  10: 'OPENING_BANK_ACCOUNT',
  11: 'OFFLINE_CONTRACT',
  12: 'BANK_SCORE_WITHOUT_PAY',
  13: 'FILING_PAYMENT',
  14: 'ALLOCATION_PREPAYMENT',
  15: 'BANK_ACCOUNT_VERIFICATION',
  16: 'DIGITAL_SIGNATURE_AND_ONLINE_CONTRACT',
  17: 'GENERATE_DIGITAL_SIGNATURE',
  18: 'SIGNING_DOCUMENT',
  19: 'ENOTE',
  20: 'ARCHIVE',
  21: 'ACCOUNT_BLOCK',
  23: 'CHECK_CREDIT_FILE',
  24: 'INSTALLMENT_SELLS',
  25: 'DIGIPAY_SUBSCRIPTION',
  26: 'SMC_SCORE',
};

export const transformStepCodeToText = (stepCode: number): StepKind => {
  return <StepKind>StepCodes[stepCode];
};
