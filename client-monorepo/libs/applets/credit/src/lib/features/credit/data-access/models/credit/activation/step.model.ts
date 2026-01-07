export interface Step {
  code: number;
  title: string;
  description: string;
  status: number;
  primary: boolean;
  stepType: number;
  group: boolean;
  child: Step[];
  stepResult: string;
  startedDate: number;
  completedDate: number;
  image: string;
  active: boolean;
  actionText: string;
  color: string;
  stepTag: number;
  activationTitle: string;
  // When moreInfo is true, a step has a special description
  // (which is an HTML page hosted in the given moreInfoUrl)
  moreInfo: boolean;
  moreInfoText: string;
  moreInfoUrl: string;
  // NOT IN THE API, CLIENT SIDE
  // WALLET_ACTIVATION is not viewable (is not a real step)
  // and used for displaying the ACTIVATE button
  kind: StepKind;

  statusText:
    | 'INITIATE'
    | 'INPROGRESS'
    | 'OPERATIONAL_PENDING'
    | 'OPERATIONAL_ACCEPTANCE'
    | 'OPERATIONAL_REJECTION'
    | 'COMPLETED'
    | 'FAILED';

  typeText: 'SERVICE_CALL' | 'UPLOAD' | 'PRE_COMPUTE' | 'USER_ACCEPTABLE';

  stepTagText:
    | 'EMPTY_TAG'
    | 'NATIONAL_CARD_FRONT'
    | 'NATIONAL_CARD_BACK'
    | 'OWNERSHIP_DOCUMENT'
    | 'JOB_DOCUMENT'
    | 'BIRTH_CERTIFICATE'
    | 'OTHER_DOCUMENT';

  state: 'WARNING' | 'ACTIVE' | 'SUCCESS' | 'ERROR' | 'DISABLED' | '';
  open: boolean;
  disabled?: boolean;
}

export type StepKind =
  | 'INIT'
  | 'REGISTER'
  | 'DIGIPAY_SCORE'
  | 'BANK_SCORE'
  | 'PROFILE'
  | 'UPLOAD'
  | 'WALLET_ACTIVATION'
  | 'CHEQUE'
  | 'OPENING_BANK_ACCOUNT'
  | 'OFFLINE_CONTRACT'
  | 'BANK_SCORE_WITHOUT_PAY'
  | 'FILING_PAYMENT'
  | 'ALLOCATION_PREPAYMENT'
  | 'BANK_ACCOUNT_VERIFICATION'
  | 'DIGITAL_SIGNATURE_AND_ONLINE_CONTRACT'
  | 'GENERATE_DIGITAL_SIGNATURE'
  | 'SIGNING_DOCUMENT'
  | 'ENOTE'
  | 'ACCOUNT_BLOCK'
  | 'CLOSE'
  | 'ARCHIVE'
  | 'CHECK_CREDIT_FILE'
  | 'INSTALLMENT_SELLS'
  | 'DIGIPAY_SUBSCRIPTION'
  | 'SMC_SCORE';
