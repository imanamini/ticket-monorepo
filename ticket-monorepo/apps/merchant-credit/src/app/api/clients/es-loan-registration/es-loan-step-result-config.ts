export enum ES_LOAN_ICS_STATES {
  // INIT = 0,
  // MAX_CREDIT_AMOUNT_REVISE=1,
  ICS = 3,
  IDENTITY_EVALUATION = 4,
  FUND_PROVIDER_ACTIVATION = 6,
  APPROVED = 7,
  CANCELED = 11,
  ICS_REJECTED = 8,
  IDENTITY_EVALUATION_REJECTED = 9,
  FUND_PROVIDER_ACTIVATION_REJECTED = 10,
  // MAX_CREDIT_AMOUNT_REVISE_REJECTED=12,
  FUND_PROVIDER_REGISTRATION = 13,
  FUND_PROVIDER_REGISTRATION_REJECTED = 14
}

export const EsLoanStepResultConfig: { [key in ES_LOAN_ICS_STATES]?: any } = {
  [ES_LOAN_ICS_STATES.ICS]: {
    title: 'در حال انجام امکان‌سنجی بانکی',
    message: 'درحال بررسی امکان دریافت اعتبار شما هستیم، لطفا منتظر بمانید.',
    timer: {
      timeInSeconds: 60,
      timerType: 'mm:ss'
    },
    staticImage: 'assets/icons/waiting-ics.svg'
  },
  [ES_LOAN_ICS_STATES.ICS_REJECTED]: {
    title: 'متاسفانه درخواست شما برای دریافت تسهیلات رد شد',
    message: 'طبق نتیجه امکان‌سنجی، در حال حاضر امکان درخواست وام برای شما وجود ندارد.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    },
      {
        id: 'secondary',
        buttonMode: 'default',
        buttonStyle: 'link',
        label: 'اطلاعات بیشتر'
      }],
    timer: {},
    staticImage: 'assets/icons/signature-failed.svg'
  },
  [ES_LOAN_ICS_STATES.IDENTITY_EVALUATION]: {
    title: 'در حال بررسی صحت شماره شبا',
    message: 'شماره شبا وارد شده درحال صحت‌سنجی می‌باشد. پس از بررسی، نتیجه را از طریق پیامک به شما اطلاع‌رسانی می‌کنیم.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    staticImage: 'assets/icons/waiting-evaluation.svg'
  },
  [ES_LOAN_ICS_STATES.IDENTITY_EVALUATION_REJECTED]: {
    title: 'متاسفانه! شماره شبا رد شد.',
    message: 'شماره شبای وارد شده متعلق به فروشنده در دیجی‌کالا نیست. لطفا شماره شبا با نام فروشنده ثبت کنید.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    staticImage: 'assets/icons/signature-failed.svg'
  }, [ES_LOAN_ICS_STATES.FUND_PROVIDER_REGISTRATION]: {
    title: 'درحال ارسال اطلاعات به بانک',
    message: 'اطلاعات شما درحال ارسال به بانک است، لطفا منتظر بمانید.',
    timer: {
      timeInSeconds: 60,
      timerType: 'mm:ss'
    },
    staticImage: 'assets/icons/waiting-bank.svg'
  },
  [ES_LOAN_ICS_STATES.FUND_PROVIDER_REGISTRATION_REJECTED]: {
    title: 'درحال ارسال اطلاعات به بانک',
    message: 'متاسفانه مشکلی پیش آمده است؛ پس از برطرف شدن از طریق پیامک به شما اطلاع خواهیم داد.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    timer: {},
    staticImage: 'assets/icons/signature-failed.svg'
  },
  [ES_LOAN_ICS_STATES.FUND_PROVIDER_ACTIVATION_REJECTED]: {
    title: 'سقف اعتباری شما رد شد',
    message: 'متاسفانه سقف اعتباری انتخاب شده شما توسط بانک رد شده است.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    timer: {},
    staticImage: 'assets/icons/signature-failed.svg'
  },
  [ES_LOAN_ICS_STATES.APPROVED]: {
    title: 'حداعتباری توسط بانک قبول شده‌است.',
    message: ' اعتبار شما به زودی فعال خواهدشد و از این پس می‌توانید بعد از صدور فاکتور درخواست تسویه بدهید.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    timer: {},
    staticImage: 'assets/icons/submit-illustration.svg'
  },
  [ES_LOAN_ICS_STATES.CANCELED]: {
    title: 'متاسفانه! شما مجاز به ادامه فرایند نیستید.',
    message: 'برای اطلاعات بیشتر با پشتیبانی تماس بگیرید',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    timer: {},
    staticImage: 'assets/icons/signature-failed.svg'
  }
};
