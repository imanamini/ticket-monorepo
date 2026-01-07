export enum ErrorStatus {
  REGISTRATION_IDENTITY_INQUIRY_ERROR = 1138,
  SHAHKAR_INQUIRY_ERROR = 1140,
  INVALID_PARAMETER = 1054,
  MERCHANT_CREDIT_OFAC_ERROR = 15645,
  MERCHANT_CREDIT_MILITARY_SERVICE_ERROR = 15646
}

export interface ConfigAction {
  title: string;
  message: string;
  buttons: buttons[];
  staticImage: string;
}

export interface buttons {
  id: string;
  buttonMode: string;
  buttonStyle: string;
  label: string;
}

export const InitializeIdentityEvaluationConfig: { [key in ErrorStatus]: ConfigAction } = {
  [ErrorStatus.REGISTRATION_IDENTITY_INQUIRY_ERROR]: {
    title: 'متاسفانه، امکان احراز هویت را نداریم',
    message: 'لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'تلاش مجدد'
    },
      {
        id: 'secondary',
        buttonMode: 'default',
        buttonStyle: 'link',
        label: 'بستن'
      }],
    staticImage: 'assets/icons/no-service.svg'
  },
  [ErrorStatus.SHAHKAR_INQUIRY_ERROR]: {
    title: 'شماره همراه و کدملی شما مطابقت ندارد',
    message: 'لطفا جهت تغییر شماره همراه با پشتیبانی تماس بگیرید.',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    staticImage: 'assets/icons/signature-failed.svg'
  },
  [ErrorStatus.MERCHANT_CREDIT_OFAC_ERROR]: {
    title: 'کاربر غیرمجاز',
    message: 'شما مجاز به ادامه فرایند ثبت‌نام نیستید.برای اطلاعات بیشتر با پشتیبانی تماس بگیرید',
    buttons: [{
      id: 'primary',
      buttonMode: 'default',
      buttonStyle: 'tinted',
      label: 'متوجه شدم'
    }],
    staticImage: 'assets/icons/signature-failed.svg'
  },

  [ErrorStatus.MERCHANT_CREDIT_MILITARY_SERVICE_ERROR]:
    {
      title: 'وضعیت نظام وظیفه',
      message: 'شما مشمول خدمت وظیفه عمومی هستید.ادامه فرایند ثبت‌نام برای افراد مشمول مجاز نیست .',
      buttons: [{
        id: 'primary',
        buttonMode: 'default',
        buttonStyle: 'tinted',
        label: 'متوجه شدم'
      }],
      staticImage: 'assets/icons/signature-failed.svg'
    },
  [ErrorStatus.INVALID_PARAMETER]:
    {
      title: 'سن قانونی',
      message: 'سن شما زیر ۱۸ سال است.ادامه فرایند ثبت‌نام برای افراد زیر ۱۸ سال مجاز نیست.',
      buttons: [{
        id: 'primary',
        buttonMode: 'default',
        buttonStyle: 'tinted',
        label: 'متوجه شدم'
      }],
      staticImage: 'assets/icons/signature-failed.svg'
    }
};
