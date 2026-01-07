export const MOCK_STEPS = {
  result: {
    title: 'SUCCESS',
    status: 0,
    message: 'عملیات با موفقیت انجام شد',
    level: 'INFO'
  },
  steps: [
    {
      uid: 'middleeast-choose-degree-step',
      label: 'انتخاب مدارک و تعیین سقف',
      buttonType: 3,
      buttonLabel: 'انتخاب مدارک',
      actionType: 2,
      description: 'در این مرحله با انتخاب مدارکی که میتوانید ارائه دهید ؛ سقف مبلغ دریافتی خود را مشخص کنید',
      profileId: 'c0417eb4-81b1-4f0c-a595-9fd3f5095ce5'
    },
    {
      uid: 'middleeast-bank-validation-step',
      label: 'اعتبارسنجی بانکی',
      buttonType: 3,
      buttonLabel: 'شروع اعتبار سنجی',
      actionType: 2,
      description: 'در این مرحله ی اعتبارسنجی؛با استعلام از بانک مرکزی ایران؛امکان دریافت اعتبار مورد نظر بررسی می شود.',
      profileId: 'c0417eb4-81b1-4f0c-a595-9fd3f5095ce5'
    },
    {
      uid: 'middleeast-payment-registration-fee-step',
      label: 'پرداخت هزینه ثبت نام',
      buttonType: 3,
      buttonLabel: 'پرداخت هزینه',
      actionType: 2,
      description: 'جهت انجام مراحل هویت سنجی و افتتاح حساب؛نیازمند واریز هزینه ای جهت انجام امور خواهید بود.',
      profileId: 'c0417eb4-81b1-4f0c-a595-9fd3f5095ce5'
    },
    {
      uid: 'middleeast-authentication-verification-documents-step',
      label: 'احراز هویت و بررسی مدارک',
      buttonType: 3,
      buttonLabel: 'شروع احراز هویت',
      actionType: 2,
      description: '',
      profileId: 'c0417eb4-81b1-4f0c-a595-9fd3f5095ce5'
    }
  ],
  currentStep: 2030
};
