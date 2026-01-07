import { Buttons, IconStateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { StateType } from '@digipay/ngx-status-result';

export interface CreditScoringStepResultDataInterface {
  title: string;
  type: StateType;
  iconState: IconStateType;
  description: string;
  calloutTitle?: string;
  calloutMessages?: string[];
  buttons?: Buttons[];
  hasCloseIcon?: boolean;
}

export const CreditSmartScoringStepResultData: {
  [key: string]: CreditScoringStepResultDataInterface;
} = {
  OTP_CODE_RESEND_EXCEEDED: {
    title: 'محدودیت درخواست کد',
    description:
      'شما بیش از حد مجاز درخواست کد یک‌بارمصرف داده‌اید. هر کاربر می‌تواند روزانه حداکثر ۳ بار درخواست ارسال کد داشته باشد. لطفاً فردا دوباره تلاش کنید.',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditSmartScoringErrorOtpRequestButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  USER_IN_BLACKLIST: {
    title: 'شما دارای اقساط معوق در دیجی‌پی هستید',
    description:
      'به علت وجود بدهی، انجام این مرحله برای شما امکان‌پذیر نیست. شما می‌توانید ۲۴ ساعت بعد از پرداخت بدهی دوباره درخواست دهید.',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditSmartScoringErrorBlackListButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  USER_IS_DECEASED: {
    title: 'صاحب این کد ملی فوت شده است',
    description: 'امکان ارائه اعتبار بانکی برای این کد ملی وجودندارد.',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditSmartScoringErrorDeadButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  USER_HAVE_ACTIVE_PLAN: {
    title: 'محدودیت ارائه خدمات اعتباری',
    description: 'شما اعتبار فعال دارید و در حال حاضر امکان ارائه طرح اعتباری برای شما وجود ندارد.',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditSmartScoringErrorActivePlanButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  USER_HAVE_ON_GOING_PLAN: {
    title: 'محدودیت در انتخاب چند طرح هم‌زمان',
    description:
      'برای کد ملی شما با شماره همراه {phoneNumber}، طرح اعتباری مشابهی در حال فعال‌سازی است. امکان دریافت طرح جدید به‌صورت هم‌زمان وجود ندارد.',
    type: 'Status',
    iconState: 'error',
    calloutTitle: 'اقدام پیشنهادی:',
    calloutMessages: ['با شماره همراه {phoneNumber} وارد شوید.', 'درخواست قبلی را لغو کنید و سپس برای دریافت طرح جدید اقدام کنید.'],
    buttons: [
      {
        id: 'creditSmartScoringErrorOngoingPlanButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  USER_INVALID_BIRTH_DATE: {
    title: 'تاریخ تولد وارد شده اشتباه است.',
    description: 'برای دریافت وام، لطفا تاریخ تولد مالک خط را وارد کنید',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditSmartScoringErrorBirthDateButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  DP_SCORE_NOT_ENOUGH: {
    title: 'نیاز به رتبه اعتباری بالاتر',
    description: 'با توجه به نتیجه‌ی اعتبار‌سنجی، دریافت این طرح اعتباری نیازمند رتبه‌ی بالاتری است.',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditSmartScoringErrorDPFailedButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  NATIONAL_CODE_DOES_NOT_MATCH_WITH_CELL_NUMBER: {
    title: 'مغایرت مالکیت شماره همراه و کد ملی',
    description: 'برای دریافت اعتبار، باید شماره همراهی که با آن ثبت‌نام انجام ‌می‌دهید به نام خودتان باشد.',
    type: 'Status',
    iconState: 'error',
    calloutTitle: 'لطفا موارد زیر را رعایت کنید',
    calloutMessages: [
      'در ابتدا با شماره همراهی که با کدملی خودتان دریافت کرده‌اید وارد شوید.',
      'شماره همراه فعلی را به نام خودتان کنید و دوباره برای ثبت‌نام اقدام کنید.',
      'از درست واردکردن شماره کدملی اطمینان حاصل کنید.',
    ],
    buttons: [
      {
        id: 'creditSmartScoringErrorShahkarFailedButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  NO_SERVICE: {
    title: 'سرویس دهنده در دسترس نیست',
    description: 'به محض برقراری ارتباط برای ادامه فرایند ثبت‌نام از طریق پیامک اطلاع‌رسانی خواهیم کرد.',
    type: 'Retry',
    iconState: 'retry',
    hasCloseIcon: true,
    buttons: [
      {
        id: 'creditSmartScoringNoServiceButton',
        style: 'tinted-on-elevated',
        mode: 'section',
        label: 'تلاش مجدد',
      },
    ],
  },
};
