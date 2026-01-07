export const assets = {
  assets: [
    {
      type: 'SUBSCRIPTION',
      status: 0,
      expireTime: 1781089933488,
      plan: 'TITANIUM',
    },
    {
      type: 'CREDIT',
      status: 0,
      creditId: '573575881749553643431',
      balance: 0,
      installmentCount: 12,
      fundProvider: {
        fundProviderCode: 13,
        title: 'بانک تجارت',
        color: 3033752,
        logo: '119e99d0-7cea-4b86-b806-72662c193d7a',
      },
    },
    {
      type: 'BNPL_1PAY',
      status: 0,
      creditId: '3771699361743837112221',
      balance: 0,
    },
    {
      type: 'BNPL_4PAY',
      status: 0,
      creditId: '6417640591732442895876',
      balance: 50000000,
    },
    {
      type: 'BNPL',
      status: 0,
      balance: 52425288,
      balance1Pay: 2425288,
      balance4Pay: 50000000,
    },
    {
      type: 'PAY_CLUB',
      status: 0,
      coinCount: 8265,
    },
    {
      type: 'WALLET',
      status: 0,
      totalBalance: 2211,
      cashoutableBalance: 0,
      nonCashoutableBalance: 2211,
    },
  ],
};

export const installment = {
  paymentList: [
    {
      paymentType: 3,
      payload: {
        creditId: '573575881749553643431',
        isOverdue: true,
        fundProviderName: 'TEJARAT_BANK',
        fundProviderTitle: 'بانک تجارت',
        serviceType: 1,
        contractDebts: [
          {
            totalAmount: 90000,
            penaltyAmount: 0,
            daysToPenalized: 0,
            ticketDetail: [
              {
                trackingCode: '16772912041749554086407',
                count: 1,
                amount: 90000,
                clear: true,
              },
            ],
          },
        ],
      },
    },
  ],
};

export const funds = {
  success: true,
  result: [
    {
      title: 'صندوق های شاخصی',
      name: 'Index',
      balance: 1456600,
      profit: null,
    },
    {
      title: 'تامین مالی جمعی',
      name: 'CrowdFund',
      balance: 3445000,
      profit: null,
    },
    {
      title: 'کیف ثروت',
      name: 'Wallet',
      balance: 56000,
      profit: null,
    },
    {
      title: 'صندوق های مبتنی بر طلا',
      name: 'Gold',
      balance: 89000,
      profit: null,
    },
    {
      title: 'صندوق های درآمد ثابت',
      name: 'FixedIncome',
      balance: 8976000,
      profit: null,
    },
  ],
  error: null,
  localTime: '2025-06-11T16:30:06.3589413+03:30',
};
