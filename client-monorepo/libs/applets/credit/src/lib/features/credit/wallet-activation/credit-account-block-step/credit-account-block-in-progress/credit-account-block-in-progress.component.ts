import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'app-credit-account-block-in-progress',
  templateUrl: './credit-account-block-in-progress.component.html',
  styleUrls: ['./credit-account-block-in-progress.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, NgxAlert, NgxCalloutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockInProgressComponent {
  checkCountDown = 90;
  title = signal<string>('بررسی حساب سازمانی');
  subtitle = signal<string>(
    ' تا پایان بررسی، مبلغی معادل یک قسط به‌صورت موقت در حساب سازمانی مسدود می‌شود و امکان استفاده از آن را ندارید.',
  );
  timer = signal<TimerCountDownModel>({
    timeInSeconds: this.checkCountDown,
    timerType: 'with-badge',
  });
  finishCountDown = output();
  close = output();

  onFinish(): void {
    this.finishCountDown.emit();
  }

  onCtaClick() {
    this.close.emit();
  }
}
