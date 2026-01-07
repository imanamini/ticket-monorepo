import { CreditTitleBarActionImage } from '../../../components/credit-app-bar/credit-app-bar.component';

export interface CreditScoringStepResultDataInterface {
  title: string;
  description?: string; // html
  callout?: {
    title: string;
    messages: string[];
  };
  actionIcon?: CreditTitleBarActionImage;
  actionText?: string;
}

export type ScoringStatusType = 'SUCCESS' | 'FAILED' | 'SHAHKAR_FAILED';
export const CreditScoringSmcStepResultData: {
  [key: string]: CreditScoringStepResultDataInterface;
} = {
  FAILED: {
    title: 'متأسفیم، در حال حاضر شرایط لازم برای دریافت اعتبار را ندارید.',
    description: 'با توجه به نتیجه اعتبارسنجی، فعلاً امکان ارائه طرح اعتباری برای شما وجود ندارد.',
    actionIcon: 'headphone',
    actionText: 'پشتیبانی',
  },
  SHAHKAR_FAILED: {
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
