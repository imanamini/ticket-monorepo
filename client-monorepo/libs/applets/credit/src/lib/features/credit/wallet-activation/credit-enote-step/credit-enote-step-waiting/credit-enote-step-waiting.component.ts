import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-enote-step-waiting',
  templateUrl: './credit-enote-step-waiting.component.html',
  styleUrls: ['./credit-enote-step-waiting.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepWaitingComponent {
  switchTypePossible = input<boolean>();
  buttons: Buttons[] = [
    {
      style: 'fill',
      id: 'creditEnoteWaitingConfirmButton',
      label: 'متوجه شدم',
      mode: 'section',
    },
  ];
  title = 'در حال صدور سفته الکترونیک شما هستیم';
  message = 'پس از دریافت نتیجه، از طریق پیامک شما را برای ادامه فرایند ثبت‌نام مطلع خواهیم کرد.';
  finish = output<void>();
  changeNoteTypeClicked = output<void>();

  close(): void {
    this.finish.emit();
  }
}
