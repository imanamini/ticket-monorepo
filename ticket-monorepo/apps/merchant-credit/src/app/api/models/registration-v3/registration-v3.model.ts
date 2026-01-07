export interface DocumentItems {
  maxCreditAmount: number;
  message?: string;
  subItems?: subItems[];
}

export interface DocumentForBranchesItems {
  maxCreditAmount: number;
  items?: string[];
}

export interface subItems {
  title: string;
  description?: string;
  items?: Items[];
}

export interface Items {
  id?: string;
  name: string;
}

export const samanDocumentForBranchIndividual: DocumentForBranchesItems[] = [
  {
    maxCreditAmount: 7000000000,
    items: [
      'اصل کارت ملی صاحب یا صاحبان حساب (احراز هویت)',
      'اصل مدارک محل سکونت / محل کسب (اجاره نامه، سند مالکیت یا ...) (احراز هویت)'

    ]
  },
  {
    maxCreditAmount: 10000000000,
    items: [
      'اصل کارت ملی صاحب یا صاحبان حساب (احراز هویت)',
      'اصل مدارک محل سکونت / محل کسب (اجاره نامه، سند مالکیت یا ...) (احراز هویت)',
      'گواهی تبصره ۱ ماده ۱۸۶ قانون مالیات‌های مستقیم (کسب و کار)'
    ]
  }
];

export const samanDocumentForBranchesLegal: DocumentForBranchesItems[] = [
  {
    maxCreditAmount: 10000000000,
    items: [
      'اصل کارت ملی تمامی اعضای هیئت مدیره و صاحبان امضای مجاز و دارای حق برداشت',
      'اصل و تصویر اگهی تأسیس مندرج در روزنامه رسمی',
      'اصل و تصویر اساسنامه یا شرکتنامه',
      'اصل و تصویر آخرین آگهی تغییرات در روزنامه رسمی'
    ]
  },
  {
    maxCreditAmount: 50000000000,
    items: [
      'اصل کارت ملی تمامی اعضای هیئت مدیره و صاحبان امضای مجاز و دارای حق برداشت',
      'اصل و تصویر آگهی تأسیس مندرج در روزنامه رسمی',
      'اصل و تصویر اساسنامه یا شرکتنامه',
      'اصل و تصویر آخرین آگهی تغییرات در روزنامه رسمی',
      'گواهی تبصره ۱ ماده ۱۸۶ قانون مالیات‌های مستقیم'
    ]
  }
];
export const samanDocumentIndividual: DocumentItems[] = [
  {
    maxCreditAmount: 7000000000,
    message: 'بانک سامان',
    subItems: [
      {
        title: 'مدارک احراز هویت:',
        items: [
          {
            name: 'اصل کارت ملی صاحب یا صاحبان حساب ',
          }
        ]
      },
    ]
  },
  {
    maxCreditAmount: 10000000000,
    message: 'بانک سامان',
    subItems: [
      {
        title: 'مدارک احراز هویت:',
        items: [
          {
            name: 'اصل کارت ملی صاحب یا صاحبان حساب',
          }
        ]
      },
      {
        title: 'مدارک کسب‌وکار:',
        description: 'با داشتن حداقل یکی از موارد زیر می توانید اعتبارسنجی کسب‌وکار خود را برای بانک انجام دهید.',
        items: [
          {
            id: 'الف',
            name: 'گواهی تبصره ۱ ماده ۱۸۶ قانون مالیات‌های مستقیم'
          }
        ]
      }
    ]
  }
];
export const samanDocumentLegal: DocumentItems[] = [
  {
    maxCreditAmount: 10000000000,
    message: 'بانک سامان',
    subItems: [
      {
        title: 'مدارک احراز هویت:',
        items: [
          {
            name: 'اصل کارت ملی تمامی اعضای هیئت مدیره و صاحبان امضای مجاز و دارای حق برداشت',
          }
        ]
      },
      {
        title: 'مدارک کسب و کار:',
        items: [

          {
            name: 'اصل و تصویر اگهی تأسیس مندرج در روزنامه رسمی'
          },
          {
            name: 'اصل و تصویر اساسنامه یا شرکتنامه'
          },
          {
            name: 'اصل و تصویر آخرین آگهی تغییرات در روزنامه رسمی'
          }
        ]

      },
    ]
  },
  {
    maxCreditAmount: 50000000000,
    message: 'بانک سامان',
    subItems: [
      {
        title: 'مدارک کسب‌وکار:',
        items: [
          {

            name: 'اصل کارت ملی تمامی اعضای هیئت مدیره و صاحبان امضای مجاز و دارای حق برداشت'
          },
        ]
      },
      {
        title: 'مدارک کسب و کار:',
        items: [

          {
            name: 'اصل و تصویر آگهی تأسیس مندرج در روزنامه رسمی'
          },
          {
            name: 'اصل و تصویر اساسنامه یا شرکتنامه'
          },
          {
            name: 'اصل و تصویر آخرین آگهی تغییرات در روزنامه رسمی'
          },
          {
            name: 'گواهی تبصره ۱ ماده ۱۸۶ قانون مالیات‌های مستقیم'
          }
        ]
      }
    ]
  }
];
