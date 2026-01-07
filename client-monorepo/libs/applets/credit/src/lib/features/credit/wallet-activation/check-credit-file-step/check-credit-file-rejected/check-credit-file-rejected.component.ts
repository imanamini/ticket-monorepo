import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {
  CHECK_CREDIT_FILE_RESULT,
  CHECK_CREDIT_FILE_RESULT_ITEM_TRANSLATION,
} from '../../../data-access/models/credit/activation/check-credit-file/check-credit-file-result';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxAlert } from '@digipay/ngx-alert';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-check-credit-file-rejected',
  templateUrl: './check-credit-file-rejected.component.html',
  styleUrls: ['./check-credit-file-rejected.component.scss'],
  standalone: true,
  imports: [NgxCalloutComponent, NgxStatusResultModule, NgxAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckCreditFileRejectedComponent {
  title = 'متاسفانه درخواست شما رد شد';
  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'fill',
      label: 'متوجه شدم',
      fullWidth: true,
      mode: 'form',
    },
  ];
  creditFileResult = input<CHECK_CREDIT_FILE_RESULT>();
  message = input<string>();
  creditFileResultTranslation = signal(CHECK_CREDIT_FILE_RESULT_ITEM_TRANSLATION);

  messages = computed(() => this.creditFileResult()?.map((item) => this.creditFileResultTranslation()[item]));
  close = output();

  closeStep() {
    this.close.emit();
  }
}
