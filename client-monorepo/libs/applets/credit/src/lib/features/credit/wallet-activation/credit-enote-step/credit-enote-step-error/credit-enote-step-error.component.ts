import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons, IconStateType, StateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditEnoteStateType } from '../models/credit-enote-result';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

const errorData: {
  [key: string]: {
    title: string;
    type: StateType;
    iconState?: IconStateType;
    description: string;
    timer?: TimerCountDownModel;
    buttons: Buttons[];
    showTitleBar: boolean;
    pageTitle?: string;
    hasCloseIcon?: boolean;
  };
} = {
  EXPIRED: {
    title: 'مهلت تکمیل سفته به پایان رسید',
    description:
      'برای تکمیل فرایند صدور سفته، باید مراحل صدور تا امضای سفته حداکثر تا ساعت ۲۴ همان روز انجام شود. لطفاً دوباره برای صدور سفته اقدام کنید.',
    showTitleBar: true,
    type: 'Status',
    iconState: 'error',
    timer: { timerType: 'mm:ss', timeInSeconds: 10 },
    buttons: [
      {
        fullWidth: true,
        id: 'enoteExpiredResubmitButton',
        style: 'fill',
        mode: 'form',
        label: 'تلاش مجدد',
        timer: { timerType: 'mm:ss', timeInSeconds: 10 },
      },
    ],
    pageTitle: 'سفته الکترونیک',
  },
  NO_SERVICE: {
    title: 'سرویس دهنده در دسترس نیست',
    description: 'در حال حاضر سرویس دهنده در دسترس نیست. لطفاً برای ادامه فرآیند دوباره تلاش کنید.',
    showTitleBar: false,
    type: 'Retry',
    iconState: 'retry',
    hasCloseIcon: true,
    buttons: [
      {
        id: 'enoteNoServiceButton',
        style: 'tinted-on-elevated',
        mode: 'section',
        label: 'تلاش مجدد',
      },
    ],
  },
  ENOTE_ERROR: {
    title: 'خطا در صدور سفته الکترونیک',
    description: 'متاسفانه در هنگام صدور سفته الکترونیک مشکلی پیش آمده است. مجدد تلاش کنید.',
    showTitleBar: false,
    type: 'Retry',
    hasCloseIcon: true,
    buttons: [
      {
        id: 'enoteIssueErrorResubmitButton',
        style: 'tinted-on-elevated',
        mode: 'section',
        label: 'تلاش مجدد',
      },
    ],
  },
  SANA_NOT_REGISTERED: {
    title: 'شما در سامانه ثنا ثبت نام نکرده‌اید',
    description:
      ' ابتدا در سامانه ثبت نام الکترونیکی قضایی (ثنا) ثبت نام کنید، سپس به برنامه دیجی‌پی بازگردید و دوباره برای دریافت سفته اقدام کنید.',
    showTitleBar: false,
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'enoteSanaErrorEnrollButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'ثبت‌ نام ثنا',
      },
    ],
  },
};
@Component({
  selector: 'app-credit-enote-step-error',
  templateUrl: './credit-enote-step-error.component.html',
  styleUrls: ['./credit-enote-step-error.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepErrorComponent {
  state = input<CreditEnoteStateType>();
  data = computed(() => errorData[this.state()!]);
  padding = computed(() => this.state() !== 'NO_SERVICE' && this.state() !== 'ENOTE_ERROR');
  submitted = output<void>();
  goToSana = output<void>();
  back = output<void>();

  onActionClick(id: string) {
    if (id === 'enoteSanaErrorEnrollButton') {
      this.goToSana.emit();
      return;
    }
    this.submitted.emit();
  }

  protected readonly close = close;
}
