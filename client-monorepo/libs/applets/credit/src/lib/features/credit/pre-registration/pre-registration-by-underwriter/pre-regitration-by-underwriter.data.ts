import { PlanGroup, PlanRuleEnum } from '../../data-access/models/credit/pre-registration/credit-plan-group';
import { PAYMENT_METHOD } from '../../data-access/models/credit/pre-registration/payment-method.model';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';

export const isIranPlans: PlanGroup[] = [
  {
    fundProvider: {
      fundProviderCode: 13,
      name: 'بانک تجارت',
      active: true,
      icon: '119e99d0-7cea-4b86-b806-72662c193d7a',
      color: '#2E4A98',
    },
    collateralDto: {
      name: 'کسر از حقوق',
      type: 'UN_PAYABLE',
      description: {
        header: 'نکات مهم',
        body: 'بصورت ماهیانه از حقوق شما کسر خواهد شد.',
        bodyList: ['بصورت ماهیانه از حقوق شما کسر خواهد شد.'],
      },
    },
    planRegistrationFlowDto: {
      name: 'آنلاین',
      type: 'ONLINE',
      description: {
        header: 'ثبت‌نام آنلاین',
      },
    },
    details: [
      {
        order: 1,
        description: {
          body: 'داشتن حساب بانک تجارت الزامی نیست.',
        },
      },
      {
        order: 2,
        description: {
          body: 'داشتن حداقل ۱۸ و حداکثر ۷۰ سال سن.',
        },
      },
      {
        order: 3,
        description: {
          body: 'بازپرداخت کل مبلغ دریافتی الزامی‌ست.',
        },
      },
    ],
    installmentCount: 12,
    installmentAmount: 9408000,
    allocationPrepaymentAmount: 9740000,
    allocationPrepaymentPercentage: 9.74,
    collateralAmount: 150000000,
    payableAmount: 122632000,
    sumInstallmentAmount: 112892000,
    interestPercentage: 23,
    groupId: '2b21ae0e-88b6-4c94-a8cf-109017898b13',
    creditAmount: 100000000,
    maxInstallmentAmount: 9414586,
    planId: '34a7c7d0-2e0c-4ab7-be6f-4cf0dfa157ef',
    active: true,
    hasAllocationPrepayment: true,
    preRegisterWithDelay: false,
    serviceType: 1,
    paymentMethod: 0,
    planRuleType: PlanRuleEnum.STATIC,
  },
  {
    fundProvider: {
      fundProviderCode: 13,
      name: 'بانک تجارت',
      active: true,
      icon: '119e99d0-7cea-4b86-b806-72662c193d7a',
      color: '#2E4A98',
    },
    collateralDto: {
      name: 'کسر از حقوق',
      type: 'UN_PAYABLE',
      description: {
        header: 'نکات مهم',
        body: 'بصورت ماهیانه از حقوق شما کسر خواهد شد.',
        bodyList: ['بصورت ماهیانه از حقوق شما کسر خواهد شد.'],
      },
    },
    planRegistrationFlowDto: {
      name: 'آنلاین',
      type: 'ONLINE',
      description: {
        header: 'ثبت‌نام آنلاین',
      },
    },
    details: [
      {
        order: 1,
        description: {
          body: 'داشتن حساب بانک تجارت الزامی نیست.',
        },
      },
      {
        order: 2,
        description: {
          body: 'داشتن حداقل ۱۸ و حداکثر ۷۰ سال سن.',
        },
      },
      {
        order: 3,
        description: {
          body: 'بازپرداخت کل مبلغ دریافتی الزامی‌ست.',
        },
      },
    ],
    installmentCount: 12,
    installmentAmount: 14111000,
    allocationPrepaymentAmount: 14480000,
    allocationPrepaymentPercentage: 9.653333400000001,
    collateralAmount: 225000000,
    payableAmount: 183818000,
    sumInstallmentAmount: 169338000,
    interestPercentage: 23,
    groupId: '30bc01c3-2981-4014-aaba-487246bda7d9',
    creditAmount: 150000000,
    maxInstallmentAmount: 14116379,
    planId: '34a7c7d0-2e0c-4ab7-be6f-4cf0dfa157ef',
    active: true,
    hasAllocationPrepayment: true,
    preRegisterWithDelay: false,
    serviceType: 1,
    paymentMethod: 0,
    planRuleType: PlanRuleEnum.STATIC,
  },
  {
    fundProvider: {
      fundProviderCode: 13,
      name: 'بانک تجارت',
      active: true,
      icon: '119e99d0-7cea-4b86-b806-72662c193d7a',
      color: '#2E4A98',
    },
    collateralDto: {
      name: 'کسر از حقوق',
      type: 'UN_PAYABLE',
      description: {
        header: 'نکات مهم',
        body: 'بصورت ماهیانه از حقوق شما کسر خواهد شد.',
        bodyList: ['بصورت ماهیانه از حقوق شما کسر خواهد شد.'],
      },
    },
    planRegistrationFlowDto: {
      name: 'آنلاین',
      type: 'ONLINE',
      description: {
        header: 'ثبت‌نام آنلاین',
      },
    },
    details: [
      {
        order: 1,
        description: {
          body: 'داشتن حساب بانک تجارت الزامی نیست.',
        },
      },
      {
        order: 2,
        description: {
          body: 'داشتن حداقل ۱۸ و حداکثر ۷۰ سال سن.',
        },
      },
      {
        order: 3,
        description: {
          body: 'بازپرداخت کل مبلغ دریافتی الزامی‌ست.',
        },
      },
    ],
    installmentCount: 12,
    installmentAmount: 18815000,
    allocationPrepaymentAmount: 19220000,
    allocationPrepaymentPercentage: 9.61,
    collateralAmount: 300000000,
    payableAmount: 245004000,
    sumInstallmentAmount: 225784000,
    interestPercentage: 23,
    groupId: '24fe869b-da65-4784-9f96-f74b41900199',
    creditAmount: 200000000,
    maxInstallmentAmount: 18818172,
    planId: '34a7c7d0-2e0c-4ab7-be6f-4cf0dfa157ef',
    active: true,
    hasAllocationPrepayment: true,
    preRegisterWithDelay: false,
    serviceType: 1,
    paymentMethod: 0,
    planRuleType: PlanRuleEnum.STATIC,
  },
  {
    fundProvider: {
      fundProviderCode: 13,
      name: 'بانک تجارت',
      active: true,
      icon: '119e99d0-7cea-4b86-b806-72662c193d7a',
      color: '#2E4A98',
    },
    collateralDto: {
      name: 'کسر از حقوق',
      type: 'UN_PAYABLE',
      description: {
        header: 'نکات مهم',
        body: 'بصورت ماهیانه از حقوق شما کسر خواهد شد.',
        bodyList: ['بصورت ماهیانه از حقوق شما کسر خواهد شد.'],
      },
    },
    planRegistrationFlowDto: {
      name: 'آنلاین',
      type: 'ONLINE',
      description: {
        header: 'ثبت‌نام آنلاین',
      },
    },
    details: [
      {
        order: 1,
        description: {
          body: 'داشتن حساب بانک تجارت الزامی نیست.',
        },
      },
      {
        order: 2,
        description: {
          body: 'داشتن حداقل ۱۸ و حداکثر ۷۰ سال سن.',
        },
      },
      {
        order: 3,
        description: {
          body: 'بازپرداخت کل مبلغ دریافتی الزامی‌ست.',
        },
      },
    ],
    installmentCount: 12,
    installmentAmount: 28223000,
    allocationPrepaymentAmount: 28700000,
    allocationPrepaymentPercentage: 9.5666666666,
    collateralAmount: 450000000,
    filingPaymentAmount: '۳۸۲,۴۶۰',
    payableAmount: 367375000,
    sumInstallmentAmount: 338675000,
    interestPercentage: 23,
    groupId: 'f1b797af-04c5-47ba-b4e4-87ca29c2042a',
    creditAmount: 300000000,
    maxInstallmentAmount: 28232757,
    planId: '34a7c7d0-2e0c-4ab7-be6f-4cf0dfa157ef',
    active: true,
    hasAllocationPrepayment: true,
    preRegisterWithDelay: false,
    serviceType: 1,
    paymentMethod: 0,
    planRuleType: PlanRuleEnum.STATIC,
  },
  {
    fundProvider: {
      fundProviderCode: 13,
      name: 'بانک تجارت',
      active: true,
      icon: '119e99d0-7cea-4b86-b806-72662c193d7a',
      color: '#2E4A98',
    },
    collateralDto: {
      name: 'کسر از حقوق',
      type: 'UN_PAYABLE',
      description: {
        header: 'نکات مهم',
        body: 'بصورت ماهیانه از حقوق شما کسر خواهد شد.',
        bodyList: ['بصورت ماهیانه از حقوق شما کسر خواهد شد.'],
      },
    },
    planRegistrationFlowDto: {
      name: 'آنلاین',
      type: 'ONLINE',
      description: {
        header: 'ثبت‌نام آنلاین',
      },
    },
    details: [
      {
        order: 1,
        description: {
          body: 'داشتن حساب بانک تجارت الزامی نیست.',
        },
      },
      {
        order: 2,
        description: {
          body: 'داشتن حداقل ۱۸ و حداکثر ۷۰ سال سن.',
        },
      },
      {
        order: 3,
        description: {
          body: 'بازپرداخت کل مبلغ دریافتی الزامی‌ست.',
        },
      },
    ],
    installmentCount: 12,
    installmentAmount: 47038000,
    allocationPrepaymentAmount: 47660000,
    allocationPrepaymentPercentage: 9.532,
    collateralAmount: 750000000,
    payableAmount: 612118000,
    sumInstallmentAmount: 564458000,
    interestPercentage: 23,
    groupId: 'f99c6a55-7ce4-4237-89c3-136823162537',
    creditAmount: 500000000,
    maxInstallmentAmount: 47039929,
    planId: '34a7c7d0-2e0c-4ab7-be6f-4cf0dfa157ef',
    active: true,
    hasAllocationPrepayment: true,
    preRegisterWithDelay: false,
    serviceType: 1,
    paymentMethod: 0,
    planRuleType: PlanRuleEnum.STATIC,
  },
  {
    fundProvider: {
      fundProviderCode: 13,
      name: 'بانک تجارت',
      active: true,
      icon: '119e99d0-7cea-4b86-b806-72662c193d7a',
      color: '#2E4A98',
    },
    collateralDto: {
      name: 'کسر از حقوق',
      type: 'UN_PAYABLE',
      description: {
        header: 'نکات مهم',
        body: 'بصورت ماهیانه از حقوق شما کسر خواهد شد.',
        bodyList: ['بصورت ماهیانه از حقوق شما کسر خواهد شد.'],
      },
    },
    planRegistrationFlowDto: {
      name: 'آنلاین',
      type: 'ONLINE',
      description: {
        header: 'ثبت‌نام آنلاین',
      },
    },
    details: [
      {
        order: 1,
        description: {
          body: 'داشتن حساب بانک تجارت الزامی نیست.',
        },
      },
      {
        order: 2,
        description: {
          body: 'داشتن حداقل ۱۸ و حداکثر ۷۰ سال سن.',
        },
      },
      {
        order: 3,
        description: {
          body: 'بازپرداخت کل مبلغ دریافتی الزامی‌ست.',
        },
      },
    ],
    installmentCount: 18,
    installmentAmount: 49661000,
    allocationPrepaymentAmount: 99260000,
    allocationPrepaymentPercentage: 13.234666665999999,
    collateralAmount: 1125000000,
    payableAmount: 993155000,
    sumInstallmentAmount: 893895000,
    interestPercentage: 23,
    groupId: 'a36b5e1d-8932-4ad4-a472-16add5c735a3',
    creditAmount: 750000000,
    maxInstallmentAmount: 49674125,
    planId: '34a7c7d0-2e0c-4ab7-be6f-4cf0dfa157ef',
    active: true,
    hasAllocationPrepayment: true,
    preRegisterWithDelay: false,
    serviceType: SERVICE_TYPE.CREDIT,
    paymentMethod: PAYMENT_METHOD.ALLOCATION_PREPAYMENT,
    planRuleType: PlanRuleEnum.STATIC,
  },
  {
    fundProvider: {
      fundProviderCode: 13,
      name: 'بانک تجارت',
      active: true,
      icon: '119e99d0-7cea-4b86-b806-72662c193d7a',
      color: '#2E4A98',
    },
    collateralDto: {
      name: 'کسر از حقوق',
      type: 'UN_PAYABLE',
      description: {
        header: 'نکات مهم',
        body: 'بصورت ماهیانه از حقوق شما کسر خواهد شد.',
        bodyList: ['بصورت ماهیانه از حقوق شما کسر خواهد شد.'],
      },
    },
    planRegistrationFlowDto: {
      name: 'آنلاین',
      type: 'ONLINE',
      description: {
        header: 'ثبت‌نام آنلاین',
      },
    },
    details: [
      {
        order: 1,
        description: {
          body: 'داشتن حساب بانک تجارت الزامی نیست.',
        },
      },
      {
        order: 2,
        description: {
          body: 'داشتن حداقل ۱۸ و حداکثر ۷۰ سال سن.',
        },
      },
      {
        order: 3,
        description: {
          body: 'بازپرداخت کل مبلغ دریافتی الزامی‌ست.',
        },
      },
    ],
    installmentCount: 18,
    installmentAmount: 66214000,
    allocationPrepaymentAmount: 132260000,
    allocationPrepaymentPercentage: 13.225999999999999,
    collateralAmount: 1500000000,
    payableAmount: 1324119000,
    sumInstallmentAmount: 1191859000,
    interestPercentage: 23,
    groupId: '3f5cb398-02a9-45d9-b652-4a70f7ca029c',
    creditAmount: 1000000000,
    maxInstallmentAmount: 66220833,
    planId: '34a7c7d0-2e0c-4ab7-be6f-4cf0dfa157ef',
    active: true,
    hasAllocationPrepayment: true,
    preRegisterWithDelay: false,
    serviceType: 1,
    paymentMethod: 0,
    planRuleType: PlanRuleEnum.STATIC,
  },
];
