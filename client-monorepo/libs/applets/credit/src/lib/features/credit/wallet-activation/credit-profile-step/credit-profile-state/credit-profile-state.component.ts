import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons, IconStateType, StateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditProfileStatusBaseComponent } from '../credit-profile-status-base/credit-profile-status-base.component';
import { ProfileStateType } from '../../../data-access/models/credit/activation/credit-profile-status.response';

const errorData: {
  [key: string]: {
    title: string;
    type: StateType;
    iconState?: IconStateType;
    description: string;
    timer?: TimerCountDownModel;
    buttons: Buttons[];
    pageTitle?: string;
    calloutTitle?: string;
    calloutMessages?: string[];
    hasCloseIcon?: boolean;
    alert?: string;
  };
} = {
  DEAD: {
    title: 'صاحب این کد ملی فوت شده است',
    description: 'امکان دریافت وام با این کد ملی وجود ندارد.',
    type: 'Status',
    iconState: 'error',
    alert: 'برای دریافت وام، با شماره همراهی که به نام خودتان است، وارد برنامه دیجی‌پی شوید.',
    buttons: [
      {
        id: 'creditProfileErrorDeadButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  NO_SERVICE: {
    title: 'در حال حاضر سرویس ثبت احوال دارای اختلال می باشد.',
    description: 'به محض برقراری ارتباط برای ادامه فرایند ثبت‌نام از طریق پیامک اطلاع‌رسانی خواهیم کرد.',
    type: 'Retry',
    iconState: 'retry',
    hasCloseIcon: true,
    buttons: [
      {
        id: 'creditProfileNoServiceButton',
        style: 'tinted-on-elevated',
        mode: 'section',
        label: 'تلاش مجدد',
      },
    ],
  },
  SHAHKAR: {
    title: 'مغایرت مالکیت شماره همراه و کد ملی',
    description: 'برای دریافت وام، شماره همراهی که با آن وارد برنامه دیجی‌پی شده‌اید باید به نام خودتان باشد.',
    type: 'Status',
    iconState: 'error',
    calloutTitle: 'لطفا موارد زیر را رعایت کنید:',
    calloutMessages: [
      'با شماره همراهی که به نام خودتان است، وارد برنامه دیجی‌پی شوید.',
      'یا در صورت تمایل، همین شماره را به نام خودتان کنید و سپس دوباره برای دریافت وام اقدام کنید.',
    ],
    buttons: [
      {
        id: 'creditProfileErrorContradictionButton',
        style: 'fill',
        mode: 'form',
        label: 'متوجه شدم',
        fullWidth: true,
      },
    ],
  },
  BIRTHDATE: {
    title: 'تاریخ تولد وارد شده اشتباه است.',
    description: 'برای دریافت اعتبار، لطفا تاریخ تولد مالک خط را وارد کنید',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditProfileErrorBirthDateButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
  RETRY_FAILED: {
    title: 'ثبت‌نام شما متوقف شده است',
    description: 'به علت بروز مشکل در سرویس‌های احراز هویت، شما قادر به ادامه فرایند ثبت‌نام نیستید. لطفا فرایند را لغو کنید',
    type: 'Status',
    iconState: 'error',
    buttons: [
      {
        id: 'creditProfileErrorRetryFailedButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ],
  },
};

@Component({
  selector: 'app-credit-profile-state',
  templateUrl: './credit-profile-state.component.html',
  styleUrls: ['./credit-profile-state.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, NgxAlert, NgxCalloutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProfileStateComponent extends CreditProfileStatusBaseComponent {
  state = input<ProfileStateType>();
  data = computed(() => errorData[this.state()!]);

  back = output<void>();
  reload = output<void>();

  constructor() {
    super();
  }

  onActionClick(id: string) {
    if (id === 'creditProfileNoServiceButton') {
      this.reload.emit();
    } else {
      this.back.emit();
    }
  }
}
