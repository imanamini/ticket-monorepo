import { ApiResultInterface } from '@client-monorepo/common/network';

export const DIRECT_DEBIT_ONBOARDING = '__showOnboardingDirectDebit';
export const DIRECT_DEBIT_CREATE = '___direct-debit-contract-create';
export interface DirectDebitCreateContract {
  action: {
    type: DirectDebitActionType;
    minWalletBalance: number;
  };
  duration: {
    count: number;
    timeUnit: TimeUnit;
  };
  bankCode: string;
  maxDailyTransactionAmount: number;
  nationalCode: string;
  redirectUrl: string;
}

export interface DirectDebitValidateContract {
  nationalCode: string;
}

export enum TimeUnit {
  SECOND = 1,
  MINUTE = 2,
  HOUR = 3,
  DAY = 4,
  WEEK = 5,
  MONTH = 6,
  YEAR = 7,
}

export enum DirectDebitActionType {
  CASH_IN = 0,
  DEFAULT = 1,
}

export interface DirectDebitBank {
  active: boolean;
  badge: {
    backgroundColor: string;
    borderColor: string;
    message: string;
    textColor: string;
    value: string;
  };
  cardBankLogoImageId: string;
  cardImageId: string;
  cardPrefixes: string[];
  code: string;
  colorRange: number[];
  directDebit: {
    dailyAmountMax: number;
  };
  imageId: string;
  name: string;
  profileCert: string;
  profileCertUrl: string;
  providerImages: string[];
  shouldVerify: true;
  transferAmountMax: number;
  transferAmountMin: number;
  uid: string;
  xferCert: string;
  xferCertFileUrl: string;
}

export interface DirectDebitBankResponse extends ApiResultInterface {
  banks: DirectDebitBank[];
  maxTimeout: number;
}

export const transactionAmountFormOptions: { title: string; value: number }[] = [
  { title: '5 میلیون تومان', value: 50_000_000 },
  { title: '7 میلیون تومان', value: 70_000_000 },
  { title: '10 میلیون تومان', value: 100_000_000 },
];

export interface DirectDebitContractStatusChange {
  contractId: string;
}
export interface DirectDebitContract {
  contractId: string;
  bankCode: string;
  duration: {
    timeUnit: TimeUnit;
    count: number;
  };
  status: DirectDebitContractStatus;
  action: {
    type: DirectDebitActionType;
    minWalletBalance: number;
  };
  maxDailyTransactionAmount: number;
  creationDate: number;
  activationDate: number;
  cardNumber: string;
  expirationDate: Date;
}

export interface DirectDebitContractResponse {
  contracts: DirectDebitContract[];
  result: ApiResultInterface;
}

export interface DirectDebitContractCreateResponse {
  contractId: string;
  redirectUrl: string;
  result: ApiResultInterface;
}

export interface DirectDebitResultResponse {
  result: ApiResultInterface;
  ticket: string;
  contractId: string;
  action: {
    type: DirectDebitActionType;
  };
  status: 'SUCCESS' | 'FAILED' | 'CANCELED';
}

export interface ContractResultsHeaderConfig {
  title: string;
  description: (message: string) => string;
  errorStatus?: DirectDebitResultResponse['status'];

  primaryButton: {
    title: string;
    redirectUrl: string;
  };
  secondaryButton?: {
    title: string;
    redirectUrl: string;
  };
}

export const ContractResultsHeaderStatusIcon: Record<DirectDebitResultResponse['status'], string> = {
  CANCELED: 'close-circle',
  SUCCESS: 'check-circle',
  FAILED: 'close-circle',
} as const;

export const ContractResultsErrorTranslate: Record<DirectDebitResultResponse['status'], ContractResultsHeaderConfig> = {
  CANCELED: {
    title: 'متاسفانه پرداخت مستقیم فعال نشد.',
    description: (message: string) => `${message}`,

    primaryButton: {
      title: 'فعالسازی دوباره',
      redirectUrl: '/direct-debit/create',
    },
    secondaryButton: {
      title: 'بستن',
      redirectUrl: '/wallet-management',
    },
  },
  SUCCESS: {
    title: 'پرداخت مستقیم با موفقیت فعال شد.',
    description: (message: string) => ``,
    primaryButton: {
      title: 'متوجه شدم',
      redirectUrl: '/wallet-management',
    },
  },
  FAILED: {
    title: 'متاسفانه پرداخت مستقیم فعال نشد.',
    description: (message: string) => `${message}`,

    primaryButton: {
      title: 'فعالسازی دوباره',
      redirectUrl: '/direct-debit/create',
    },
    secondaryButton: {
      title: 'بستن',
      redirectUrl: '/wallet-management',
    },
  },
} as const;

export interface ContractCreateFormState {
  validate: boolean;
  formValue: any;
}

export enum BankEnum {
  '018' = 'تجارت',
  '078' = 'خاورمیانه',
  '056' = 'سامان',
  '063' = 'سپه (انصار)',
  '057' = 'پاسارگاد',
  '052' = 'قوامین',
  '055' = 'اقتصاد نوین',
  '054' = 'پارسيان',
  '021' = 'پست بانک ایران',
  '020' = 'توسعه صادرات',
  '013' = 'رفاه',
  '015' = 'سپه',
  '058' = 'سرمایه',
  '019' = 'صادرات ایران',
  '011' = 'صنعت و معدن',
  '053' = 'کارآفرین',
  '016' = 'کشاورزی',
  '014' = 'مسکن',
  '012' = 'ملت',
  '059' = 'سینا',
  '051' = 'موسسه مالی توسعه',
  '070' = 'رسالت',
  '064' = 'گردشگری',
  '022' = 'توسعه تعاون',
  '065' = 'سپه (حکمت)',
  '073' = 'موسسه کوثر',
  '075' = 'موسسه ملل',
  '066' = 'دی',
  '069' = 'ایران زمین',
  '061' = 'شهر',
  '062' = 'آینده',
  '017' = 'ملی ايران',
  '060' = 'مهر ایران',
  '095' = 'ایران ونزویلا',
  '080' = 'نور',
  '010' = 'بانک مرکزی',
  '000' = 'بانک نامشخص',
}

export enum DirectDebitContractStatus {
  PENDING = 0,
  ACTIVE = 1,
  EXPIRED = 2,
  CANCELED = 3,
  REVOKED = 4,
  FAILED = 5,
  ABANDONED = 6,
  INITIATED = 7,
  INACTIVE = 8,
}

export const DirectDebitContractTranslate = {
  [DirectDebitContractStatus.PENDING]: 'در انتظار فعال‌سازی',
  [DirectDebitContractStatus.ACTIVE]: 'فعال',
  [DirectDebitContractStatus.EXPIRED]: 'منقضی‌شده',
  [DirectDebitContractStatus.CANCELED]: 'لغو‌شده',
  [DirectDebitContractStatus.REVOKED]: 'لغو‌شده',
  [DirectDebitContractStatus.FAILED]: 'ناموفق',
  [DirectDebitContractStatus.ABANDONED]: 'رها‌شده',
  [DirectDebitContractStatus.INITIATED]: 'در حال پردازش',
  [DirectDebitContractStatus.INACTIVE]: 'غیرفعال موقت',
};

export const DirectDebitContractColor = {
  [DirectDebitContractStatus.CANCELED]: 'neutral',
  [DirectDebitContractStatus.REVOKED]: 'neutral',
  [DirectDebitContractStatus.EXPIRED]: 'error',
  [DirectDebitContractStatus.INACTIVE]: 'warning',
};

export enum DirectDebitErrorCodes {
  IDENTITY_MISMATCH = 1117,
}
