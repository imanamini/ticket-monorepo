export interface DocumentItem {
  id: string;
  description: string;
  subItems?: string[];
}

export interface FeeItem {
  id: string;
  description: string;
  checked: boolean;
}

export const documentsNatural: DocumentItem[] = [
  {
    id: '1',
    description: 'کارت ملی و شناسنامه'
  },
  {
    id: '2',
    description: 'مدرک شغلی',
    subItems: [
      'جواز کسب',
      'گواهی اشتغال به کار',
      'کارت بازرگانی',
      'گواهی ثبت برند',
    ]
  },
  {
    id: '3',
    description: 'مدرک محل سکونت',
    subItems: [
      'سند محل فعالیت',
      'اجاره نامه رسمی',
      'قبض'
    ]
  },
  {
    id: '4',
    description: 'کد شش رقمی مالیاتی'
  },
];
export const documentsLegal: DocumentItem[] = [
  {
    id: '5',
    description: 'درخواست کتبی مبنی بر افتتاح حساب با امضاهای مجاز در سربرگ شرکت'
  },
  {
    id: '6',
    description: 'اصل و کپی اساسنامه، شرکت نامه – اظهارنامه (ثبت شرکت‌ها)'
  },
  {
    id: '7',
    description: ' اصل و کپی صفحه اول و صفحه توضیحات شناسنامه و کارت ملی کلیه اعضا هیئت مدیره و کلیه صاحبان امضا.'
  },
  {
    id: '8',
    description: 'اصل و کپی آگهی روزنامه رسمی شرکت'
  },
  {
    id: '9',
    description: 'اصل و کپی سند مالکیت یا اجاره‌نامه رسمی',
  },
  {
    id: '10',
    description: 'کد مالیتی'
  },
];

export interface LimitationDocuments {
  range: { from: number, to: number };
  documents: string[];
}

export interface MaxLimitPerDocuments {
  maxAmount: number;
  documents: string[];
}

export interface MaxLimitPerFees {
  maxAmount: number;
  fees: string[];
}

export const limitationDocumentsDataNatural: LimitationDocuments[] = [
  {
    range: {from: 1_000_000_001, to: 1_990_000_000},
    documents: [
      '1',
      '2',
      '3'
    ]
  },
  {
    range: {from: 1_990_000_001, to: 10_000_000_000},
    documents: [
      '1',
      '2',
      '3',
      '4'
    ]
  }
];

export const limitationDocumentsDataLegal: LimitationDocuments[] = [
  {
    range: {from: 200_000_000, to: 4_990_000_000},
    documents: [
      '5', '6', '7', '8', '9'
    ]
  },
  {
    range: {from: 4_990_000_001, to: 50_000_000_000},
    documents: [
      '5', '6', '7', '8', '9', '10'
    ]
  }
];

export const MiddleEastRegularPersonLimits: MaxLimitPerDocuments[] = [
  {
    maxAmount: 5_000_000_000,
    documents: [
      '1'
    ]
  },
  {
    maxAmount: 2_000_000_000,
    documents: [
      '1',
      '4'
    ]
  },
  {
    maxAmount: 5_000_000_000,
    documents: [
      '1',
      '2',
    ]
  },
  {
    maxAmount: 10_000_000_000,
    documents: [
      '1',
      '2',
      '4'
    ]
  }
];

export const middleEastProviderDocuments: DocumentItem[] = [
  {
    id: '1',
    description: 'کارت ملی و شناسنامه'
  },
  // {
  //   id: '2',
  //   description: 'مدرک کسب‌و‌کار',
  //   subItems: [
  //     'جواز کسب',
  //     'گواهی اشتغال به کار',
  //     'کارت بازرگانی',
  //     'گواهی ثبت برند',
  //   ]
  // },
  // {
  //   id: '4',
  //   description: 'کد مالیاتی'
  // },
];
export const digipayFeesNatural: FeeItem[] = [
  {
    id: '1',
    description: '2000000000',
    checked: false,
  },
  {
    id: '2',
    description: '5000000000',
    checked: false,
  },
  {
    id: '3',
    description: '10000000000',
    checked: false,
  },
];

export const digipayFeesLegal: FeeItem[] = [
  {
    id: '1',
    description: '5000000000',
    checked: false,
  },
  {
    id: '2',
    description: '10000000000',
    checked: false,
  },
  {
    id: '3',
    description: '50000000000',
    checked: false,
  },
];
export const digipayLimitationFeesNatural: MaxLimitPerFees[] = [
  {
    maxAmount: 2_000_000_000,
    fees: [
      '1'
    ]
  },
  {
    maxAmount: 5_000_000_000,
    fees: [
      '2',
    ]
  },
  {
    maxAmount: 10_000_000_000,
    fees: [
      '3',
    ]
  }
];

export const digipayLimitationFeesLegal: MaxLimitPerFees[] = [
  {
    maxAmount: 5_000_000_000,
    fees: [
      '1'
    ]
  },
  {
    maxAmount: 10_000_000_000,
    fees: [
      '2',
    ]
  },
  {
    maxAmount: 50_000_000_000,
    fees: [
      '3',
    ]
  }
];

