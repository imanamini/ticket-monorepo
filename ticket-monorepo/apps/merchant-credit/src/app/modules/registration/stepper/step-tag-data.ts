export const StepTagData: {
  [key: string]: {
    success: string,
    active: string,
    rejected: string,
    disabled: string,
  }
} = {
  'credit-revise-step': {
    success: 'سقف اعتبار شما تعیین شد',
    active: 'مدارک خود را وارد کنید',
    rejected: 'رد شده',
    disabled: 'مدارک خود را وارد کنید',
  },
  'ics-step' : {
    success: 'اعتبارسنجی شما موفق بود',
    active: 'نتیجه اعتبارسنجی را به شما اطلاع می‌دهیم',
    rejected: 'اعتبارسنجی شما رد شد',
    disabled: 'کارشناسان ما با شما در ارتباط خواهند بود',
  },
  'identity-evaluation-step' : {
    success: 'احراز هویت شما موفق بود',
    active: 'احراز هویت شما در حال بررسی است',
    rejected: 'احراز هویت شما رد شد',
    disabled: 'کارشناسان ما با شما در ارتباط خواهند بود',
  },
  'fund-provider-evaluation-step' : {
    success: 'حساب شما افتتاح شد',
    active: 'برای افتتاح حساب مراجعه حضوری کنید',
    rejected: 'افتتاح حساب شما رد شد',
    disabled: 'برای افتتاح حساب مراجعه حضوری کنید',
  },
};
