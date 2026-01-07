import { RegistrationStatus } from '../../../../api/clients/registration/basic-models/registration-status';

export interface ResultItem {
  title: string;
  description: string;
  icon?: string;
  warningMessage?: string;
  showBoxes: boolean;
}

export const stepResultData: {
  [key: string]: {
    [key: number]: ResultItem
  }
} = {
  'credit-revise-step': {
    [RegistrationStatus.REJECTED]: {
      title: 'خطا',
      description: 'ERROR: credit-revise-rejected',
      showBoxes: false
    },
    [RegistrationStatus.CANCELED]: {
      title: 'درخواست شما لغو شده است.',
      description: '',
      showBoxes: false
    },
  },
  'ics-step': {
    [RegistrationStatus.APPROVED]: {
      title: 'اعتبارسنجی شما با موفقیت انجام شد',
      description: 'همکاران ما برای بررسی مدارک با شما تماس می‌گیرند تا در صورت صحت مدارک برای افتتاح حساب اقدام کنید.',
      showBoxes: false
    },
    [RegistrationStatus.PENDING]: {
      title: 'در حال امکان‌سنجی دریافت اعتبار',
      icon: 'assets/registration-result-images/ics-pending.svg',
      description: 'درخواست شما ثبت شد. ما در حال بررسی امکان دریافت اعتبار شما هستیم. ظرف ۲۴ ساعت آینده منتظر پیامک دیجی‌پی باشید.',
      showBoxes: false
    },
    [RegistrationStatus.REJECTED]: {
      title: 'اختصاص اعتبار به حساب شما ممکن نیست',
      description: 'شما به دلیل نداشتن امتیاز بانکی کافی قادر به ادامه دادن مراحل نیستید ممکن هست این موضوع به دلیل اقساط معوقه بانکی یا چک برگشتی باشد لطفا پس از برطرف شدن مشکل مجددا ثبت نام کنید .',
      icon: 'assets/registration-result-images/ics-failed.svg',
      warningMessage: `
        <b>موارد مؤثر بر نتیجۀ امکان‌سنجی:</b>
        <br/>
        <ul>
             <li> خوش‌حسابی در بازپرداخت تسهیلات بانکی</li>
             <li> خوش‌حسابی حساب جاری (دسته‌چک) </li>
             <li>سابقۀ فعال در دریافت تسهیلات و تراکنش‌های بانکی </li>
        </ul>
      `,
      showBoxes: false
    },
    [RegistrationStatus.CANCELED]: {
      title: 'خطا',
      description: 'ERROR: ics-canceled',
      showBoxes: false
    },
  },
  'identity-evaluation-step': {
    [RegistrationStatus.APPROVED]: {
      title: 'احراز هویت شما با موفقیت انجام شد',
      description: ' معرفی نامه شما برای افتتاح حساب به بانک ارسال شد. لطفا برای تکمیل ثبت نام خود با در دست داشتن مدارک به  باجه بانک ایران ونزوئلا در دیجی‌پی مراجعه کنید ',
      showBoxes: true
    },
    [RegistrationStatus.PENDING]: {
      title: 'در حال هویت‌سنجی',
      icon: 'assets/registration-result-images/kyc-pending.svg',
      description: 'امکان‌سنجی شما با موفقیت انجام شد و درخواست شما در انتظار بررسی است. پس از بررسی مدارک، نتیجه برای شما پیامک خواهد شد.',
      showBoxes: false
    },
    [RegistrationStatus.REJECTED]: {
      title: 'هویت‌سنجی ناموفق بود',
      icon: 'assets/registration-result-images/kyc-failed.svg',
      description: 'برای دریافت اطلاع بیشتر می‌توانید با پشتیبانی دیجی‌پی با شماره 02153924000 داخلی 6 تماس بگیرید.',
      showBoxes: false
    },
    [RegistrationStatus.CANCELED]: {
      title: 'خطا',
      description: 'ERROR: identity-canceled',
      showBoxes: false
    },
  },
  'fund-provider-evaluation-step': {
    [RegistrationStatus.APPROVED]: {
      title: 'ثبت نام شما با موفقیت انجام شد',
      description: 'درخواست ثبت‌نام شما در سرویس تسویه زودتر از موعد با موفقیت انجام شد شما می توانید برای دریافت مبلغ حاصل از فروشتان در زمانی زودتر از زمان سررسید فاکتور اقدام کنید',
      showBoxes: false
    },
    [RegistrationStatus.PENDING]: {
      title: 'در انتظار افتتاح حساب',
      icon: 'assets/registration-result-images/bank-pending.svg',
      description: 'تبریک! می‌توانید برای تحویل مدارک و افتتاح حساب از راهنمای زیر کمک بگیرید.',
      showBoxes: true
    },
    [RegistrationStatus.REJECTED]: {
      title: 'افتتاح حساب ناموفق بود',
      icon: 'assets/registration-result-images/bank-failed.svg',
      description: 'متأسفیم. افتتاح حساب بانکی موفقیت‌آمیز نبود. برای رفع مشکل با شمارۀ 02153924000 داخلی 6 تماس بگیرید.',
      showBoxes: false
    },
    [RegistrationStatus.CANCELED]: {
      title: 'خطا',
      description: 'ERROR: fund-canceled',
      showBoxes: false
    },
  },
  // step result for digipay
  'digipay-credit-revise-step': {
    [RegistrationStatus.REJECTED]: {
      title: 'خطا',
      description: 'ERROR: credit-revise-rejected',
      showBoxes: false
    },
    [RegistrationStatus.CANCELED]: {
      title: 'درخواست شما لغو شده است.',
      description: '',
      showBoxes: false
    },
  },
  'digipay-ics-step': {
    [RegistrationStatus.APPROVED]: {
      title: 'اعتبارسنجی شما با موفقیت انجام شد',
      description: 'همکاران ما برای بررسی مدارک با شما تماس می‌گیرند تا در صورت صحت مدارک برای افتتاح حساب اقدام کنید.',
      showBoxes: false
    },
    [RegistrationStatus.PENDING]: {
      title: 'در حال امکان‌سنجی دریافت اعتبار',
      icon: 'assets/registration-result-images/ics-pending.svg',
      description: 'درخواست شما ثبت شد. ما در حال بررسی امکان دریافت اعتبار شما هستیم. ظرف ۲۴ ساعت آینده منتظر پیامک دیجی‌پی باشید.',
      showBoxes: false
    },
    [RegistrationStatus.REJECTED]: {
      title: 'اختصاص اعتبار به حساب شما ممکن نیست',
      description: 'شما به دلیل نداشتن امتیاز بانکی کافی قادر به ادامه دادن مراحل نیستید ممکن هست این موضوع به دلیل اقساط معوقه بانکی یا چک برگشتی باشد لطفا پس از برطرف شدن مشکل مجددا ثبت نام کنید .',
      icon: 'assets/registration-result-images/ics-failed.svg',
      warningMessage: `
        <b>موارد مؤثر بر نتیجۀ امکان‌سنجی:</b>
        <br/>
        <ul>
             <li> خوش‌حسابی در بازپرداخت تسهیلات بانکی</li>
             <li> خوش‌حسابی حساب جاری (دسته‌چک) </li>
             <li>سابقۀ فعال در دریافت تسهیلات و تراکنش‌های بانکی </li>
        </ul>
      `,
      showBoxes: false
    },
    [RegistrationStatus.CANCELED]: {
      title: 'خطا',
      description: 'ERROR: ics-canceled',
      showBoxes: false
    },

  },
  'digipay-identity-evaluation-step': {
    [RegistrationStatus.APPROVED]: {
      title: 'اعتبارسنجی شما با موفقیت انجام شد',
      description: 'همکاران ما برای بررسی مدارک با شما تماس می‌گیرند تا در صورت صحت مدارک برای افتتاح حساب اقدام کنید.',
      showBoxes: false
    },
    [RegistrationStatus.PENDING]: {
      title: 'در حال بررسی صحت شماره شبا',
      icon: 'assets/registration-result-images/digipay-ics-pending.svg',
      description: 'شماره شبا وارد شده توسط شما با موفقیت ثبت شد. پس از بررسی سرویس برای شما فعال خواهد شد.',
      showBoxes: false
    },
    [RegistrationStatus.REJECTED]: {
      title: 'متاسفانه! شماره شبا رد شد.',
      description: 'شماره شبای وارد شده متعلق به فروشنده‌ در دیجی‌کالا نیست.لطفا شماره شبا با نام فروشنده ثبت کنید.',
      icon: 'assets/registration-result-images/digipay-ics-failed.svg',
      showBoxes: false
    },
    [RegistrationStatus.CANCELED]: {
      title: 'خطا',
      description: 'ERROR: ics-canceled',
      showBoxes: false
    },
  },
};

export const successfulResult: ResultItem = {
  title: 'ثبت نام شما با موفقیت انجام شد',
  description: 'درخواست ثبت‌نام شما در سرویس تسویه زودتر از موعد با موفقیت انجام شد شما می توانید برای دریافت مبلغ حاصل از فروشتان در زمانی زودتر از زمان سررسید فاکتور اقدام کنید',
  showBoxes: false
};

export const stepResultDataLegal = JSON.parse(JSON.stringify(stepResultData));
stepResultDataLegal['identity-evaluation-step'][RegistrationStatus.PENDING] = {
  title: 'درخواست شما ثبت شد',
  icon: 'assets/registration-result-images/kyc-pending.svg',
  description: ' از اعتمادی که به دیجی‌پی دارید ممنونیم. به‌زودی و در ادامه، همکاران ما برای دریافت مدارک با شما تماس می‌گیرند.',
  showBoxes: false
};
