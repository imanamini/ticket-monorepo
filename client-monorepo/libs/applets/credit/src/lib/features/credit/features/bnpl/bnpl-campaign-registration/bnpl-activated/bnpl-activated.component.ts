import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { BnplErrorHandlingService } from '../services/bnpl-error-handling.service';
import { CreditContentBoxComponent } from '../../../../components/credit-content-box/credit-content-box.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'app-bnpl-activated',
  templateUrl: './bnpl-activated.component.html',
  standalone: true,
  imports: [CreditContentBoxComponent, NgxButtonComponent, PipesModule],
  styleUrls: ['./bnpl-activated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplActivatedComponent {
  installmentCount = input<number | null>(null);
  amount = input<number | null>(null);
  timer = signal<TimerCountDownModel>({
    timerType: 'mm:ss',
    timeInSeconds: 10,
  });

  bnplErrorHandlingService = inject(BnplErrorHandlingService);

  backToMerchant() {
    this.bnplErrorHandlingService.backToMerchant();
  }
}
