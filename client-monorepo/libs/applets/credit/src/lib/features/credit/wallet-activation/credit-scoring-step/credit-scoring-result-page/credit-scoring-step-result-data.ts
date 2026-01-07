import { CreditTitleBarActionImage } from '../../../components/credit-app-bar/credit-app-bar.component';

export interface CreditScoringStepResultDataInterface {
  pageTitle: string;
  title: string;
  description?: string; // html
  callout?: {
    title: string;
    messages: string[];
  };
  actionIcon?: CreditTitleBarActionImage;
  actionText?: string;
  buttons?: {}[];
}

export type ScoringStatusType = 'SUCCESS' | 'FAILED' | 'OFFERS' | 'SHAHKAR_FAILED';

export const CreditScoringStepResultData: {
  [key: string]: CreditScoringStepResultDataInterface;
} = {
  SUCCESS: {
    pageTitle: 'نتیجه امکان‌سنجی',
    title: 'دریافت اعتبار برای شما ممکن است',
    description: 'تبریک! برای دریافت اعتبار فرایند ثبت‌نام را ادامه بدهید.',
  },
  OFFERS: {
    pageTitle: 'نتیجه امکان‌سنجی',
    title: 'طرح انتخابی شما قابل دریافت نیست.',
    description:
      'متاسفیم، طبق نتیجه امکان‌سنجی، فعلا نمی‌توانیم طرح انتخابی را به شما اختصاص دهیم.ما طرح‌های جایگزین دیگری برای شما پیشنهاد داریم.',
    actionIcon: 'headphone',
    actionText: 'پشتیبانی',
    buttons: [
      {
        id: '',
        style: 'fill',
        mode: 'form',
        label: 'مشاهده طرح جایگزین',
      },
    ],
  },
  FAILED: {
    pageTitle: 'نتیجه امکان‌سنجی',
    title: 'نیاز به رتبه اعتباری بالاتر',
    description: 'با توجه به نتیجه‌ی اعتبارسنجی‌ شما، دریافت این طرح اعتباری نیازمند رتبه‌ی بالاتری است.',
  },
  SHAHKAR_FAILED: {
    pageTitle: 'امکان‌سنجی دریافت وام',
    title: 'شماره همراه باید به نام خودتان باشد',
    description: 'برای دریافت اعتبار، باید شماره همراهی که با آن ثبت‌نام انجام ‌می‌دهید به نام خودتان باشد.',
    callout: {
      title: 'لطفا موارد زیر را رعایت کنید:',
      messages: [
        'در ابتدا با شماره همراهی که با کدملی خودتان دریافت کرده‌اید وارد شوید.',
        'شماره همراه فعلی را به نام خودتان کنید و دوباره برای ثبت‌نام اقدام کنید.',
        'از درست واردکردن شماره کدملی اطمینان حاصل کنید.',
      ],
    },
  },
};
