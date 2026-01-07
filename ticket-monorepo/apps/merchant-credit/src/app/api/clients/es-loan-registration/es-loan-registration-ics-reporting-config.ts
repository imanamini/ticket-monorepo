export enum ES_LOAN_REGISTRATION_ICS_REPORTING_STATES {
  KYB_WAITING = 'KYB_WAITING',
  KYB_APPROVED = 'KYB_APPROVED',
  KYB_REJECT = 'KYB_REJECT',
  ICS_GENERATE_REPORT_WAITING = 'ICS_GENERATE_REPORT_WAITING'
}

export const EsLoanRegistrationIcsReportingConfig: { [key in ES_LOAN_REGISTRATION_ICS_REPORTING_STATES]?: any } = {
  [ES_LOAN_REGISTRATION_ICS_REPORTING_STATES.KYB_WAITING]: {
    title: 'درحال بررسی رتبه اعتباری ',
    message: 'در حال بررسی اعتبار و سوابق مالی شما هستیم. پس از بررسی، نتیجه را از طریق پیامک به شما اطلاع‌رسانی می‌کنیم.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    staticImage: 'assets/icons/pending-illustration.svg'
  }, [ES_LOAN_REGISTRATION_ICS_REPORTING_STATES.ICS_GENERATE_REPORT_WAITING]: {
    title: 'درحال بررسی رتبه اعتباری ',
    message: 'در حال بررسی اعتبار و سوابق مالی شما هستیم. پس از بررسی، نتیجه را از طریق پیامک به شما اطلاع‌رسانی می‌کنیم.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    staticImage: 'assets/icons/pending-illustration.svg'
  },
  [ES_LOAN_REGISTRATION_ICS_REPORTING_STATES.KYB_REJECT]: {
    title: 'متاسفانه درخواست شما برای دریافت تسهیلات رد شد',
    message: 'طبق نتیجه امکان‌سنجی، در حال حاضر امکان درخواست وام برای شما وجود ندارد.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم!'
    },
      {
        id: 'secondary',
        buttonMode: 'default',
        buttonStyle: 'link',
        label: 'اطلاعات بیشتر'
      }],
    timer: {},
    staticImage: 'assets/icons/error-illustration.svg'
  },
};
