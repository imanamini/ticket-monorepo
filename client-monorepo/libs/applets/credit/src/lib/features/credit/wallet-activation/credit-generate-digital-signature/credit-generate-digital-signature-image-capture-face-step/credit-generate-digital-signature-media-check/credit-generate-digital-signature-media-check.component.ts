import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-media-check',
  templateUrl: './credit-generate-digital-signature-media-check.component.html',
  styleUrl: './credit-generate-digital-signature-media-check.component.scss',
  imports: [NgxStatusResultModule, NgxWaitingStepperComponent, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureMediaCheckComponent implements OnInit {
  description = signal<string>('');
  title = signal<string>('');
  mediaType = input.required<'VIDEO' | 'PHOTO'>();
  back = output();

  ngOnInit() {
    switch (this.mediaType()) {
      case 'VIDEO':
        this.title.set('در انتظار بررسی ویدئو');
        this.description.set('تایید ویدئو شما چند دقیقه زمان نیاز دارد لطفا چند دقیقه‌ای صبر کنید.');
        break;
      case 'PHOTO':
        this.title.set('در انتظار بررسی عکس');
        this.description.set('تایید عکس شما چند دقیقه‌ زمان نیاز دارد لطفا چند دقیقه‌ای صبر کنید.');
        break;
    }
  }

  onBack() {
    this.back.emit();
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
