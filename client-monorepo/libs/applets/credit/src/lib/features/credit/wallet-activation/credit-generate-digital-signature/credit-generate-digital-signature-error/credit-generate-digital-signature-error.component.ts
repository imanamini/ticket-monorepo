import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { GenerateDigitalSignatureErrorTypes } from '../services/credit-generate-digital-signature.service';
import { Buttons, IconStateType, StateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

const dataMap: {
  [key: string]: {
    pageTitle: string;
    title: string;
    message: string;
    stateIcon: IconStateType;
    type: StateType;
    buttons: Buttons[];
    hasCloseIcon: boolean;
  };
} = {
  NO_SERVICE: {
    pageTitle: 'سرویس احراز هویت',
    title: 'سرویس دهنده در دسترس نیست',
    message: 'لطفا برای ادامه فرایند دقایقی دیگر دوباره اقدام کنید.',
    stateIcon: 'retry',
    type: 'Retry',
    hasCloseIcon: true,
    buttons: [
      {
        id: 'creditDigitalSignatureNoServiceRetryButton',
        label: 'تلاش دوباره',
        style: 'tinted-on-elevated',
        mode: 'section',
      },
    ],
  },
  FAILED_GENERATION: {
    pageTitle: 'ثبت امضا',
    title: 'اشکال در ثبت امضای دیجیتال',
    message: 'امضای دیجیتال شما ثبت نشد.لطفا دوباره اقدام به ثبت کنید.',
    stateIcon: 'error',
    type: 'Status',
    hasCloseIcon: false,
    buttons: [
      {
        id: 'creditDigitalSignatureErrorRetryButton',
        label: 'ثبت دوباره',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
      },
    ],
  },
};
@Component({
  selector: 'app-credit-generate-digital-signature-error',
  templateUrl: './credit-generate-digital-signature-error.component.html',
  styleUrls: ['./credit-generate-digital-signature-error.component.scss'],
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureErrorComponent {
  type = input<GenerateDigitalSignatureErrorTypes>();
  data = computed(() => dataMap[this.type()!]);

  reloadStatus = output<void>();
  close = output<void>();
  skipError = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
