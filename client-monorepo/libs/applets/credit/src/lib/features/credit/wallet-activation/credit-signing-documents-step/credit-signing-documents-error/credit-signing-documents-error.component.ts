import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CreditModule } from '../../../credit.module';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons, IconStateType, StateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxAlert } from '@digipay/ngx-alert';

const dataMap: {
  [key: string]: {
    pageTitle?: string;
    title: string;
    message: string;
    stateIcon: IconStateType;
    type: StateType;
    buttons: Buttons[];
    hasCloseIcon: boolean;
  };
} = {
  NO_SERVICE: {
    title: 'سرویس دهنده در دسترس نیست',
    message: 'به محض برقراری ارتباط برای ادامه فرایند ثبت‌نام از طریق پیامک اطلاع‌رسانی خواهیم کرد.',
    stateIcon: 'retry',
    type: 'Retry',
    hasCloseIcon: true,
    buttons: [
      {
        id: 'creditSigningDocumentNoServiceConfirmButton',
        label: 'تلاش مجدد',
        style: 'tinted-on-elevated',
        mode: 'section',
      },
    ],
  },
  DIGITAL_SIGNATURE_EXPIRED: {
    pageTitle: 'امضا آنلاین اسناد',
    title: 'امضای دیجیتال شما منقضی شده است',
    message: 'امضای دیجیتال شما برای مدت محدودی معتبر است و پس از پایان این مهلت، به‌منظور حفظ امنیت اطلاعات شما منقضی می‌شود.',
    stateIcon: 'error',
    type: 'Status',
    hasCloseIcon: false,
    buttons: [
      {
        id: 'creditSigningDocumentDigitalSignExpiredConfirmButton',
        label: 'متوجه شدم',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
      },
    ],
  },
  ERROR: {
    pageTitle: 'امضا آنلاین اسناد',
    title: 'امضای دیجیتال شما منقضی شده است',
    message: 'امضای دیجیتال شما برای مدت محدودی معتبر است و پس از پایان این مهلت، به‌منظور حفظ امنیت اطلاعات شما منقضی می‌شود.',
    stateIcon: 'error',
    type: 'Status',
    hasCloseIcon: false,
    buttons: [
      {
        id: 'creditSigningDocumentDigitalSignRevokedConfirmButton',
        label: 'متوجه شدم',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
      },
    ],
  },
  EXPIRED: {
    pageTitle: 'امضای آنلاین اسناد',
    title: 'مهلت شما به پایان رسید',
    message: 'مهلت شما برای امضای اسناد به پایان رسید و دیگر امکان ادامه مسیر را ندارید.',
    stateIcon: 'error',
    type: 'Status',
    hasCloseIcon: false,
    buttons: [
      {
        id: 'creditSigningDocumentExpiredConfirmButton',
        label: 'متوجه شدم',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
      },
    ],
  },
};

@Component({
  selector: 'app-credit-signing-documents-error',
  templateUrl: './credit-signing-documents-error.component.html',
  styleUrls: ['./credit-signing-documents-error.component.scss'],
  standalone: true,
  imports: [CreditModule, CreditAppBarComponent, NgxStatusResultModule, NgxAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsErrorComponent {
  type = input<
    | 'NO_SERVICE'
    | 'ERROR'
    | 'EXPIRED'
    | 'CREDIT_ONB_SIGNING_DOCUMENT_PASSWORD_INCORRECT'
    | 'CREDIT_ONB_SIGNING_DOCUMENT_EXPIRED'
    | 'DIGITAL_SIGNATURE_EXPIRED'
    | null
  >();

  showAppbar = computed(() => ['DIGITAL_SIGNATURE_EXPIRED', 'EXPIRED'].includes(this.type() ?? ''));
  showAlert = computed(() => ['DIGITAL_SIGNATURE_EXPIRED'].includes(this.type() ?? ''));

  data = computed(() => dataMap[this.type()!]);

  close = output<void>();
}
