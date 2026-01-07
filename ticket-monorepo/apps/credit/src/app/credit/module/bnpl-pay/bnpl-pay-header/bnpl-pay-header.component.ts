import { Component, computed, inject, input, output } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CancelService } from '../../../shared/services/cancel.service';

@Component({
  selector: 'app-bnpl-pay-header',
  standalone: true,
  imports: [
    NgxIcon,
    PipesModule,
  ],
  templateUrl: './bnpl-pay-header.component.html',
  styleUrl: './bnpl-pay-header.component.scss'
})
export class BnplPayHeaderComponent {
  installmentCount = input<number>(null);
  purchaseAmount = input<number>(null);
  purchaseAmountTitle = input<string>('مبلغ');
  title = computed<string>(() => {
    return this.installmentCount() === 1 ? 'اعتبار ماهانه' : 'اعتبار ' + (this.installmentCount() + 1) + ' قسطه';
  });
  private cancelService = inject(CancelService);

  backHandler() {
    this.cancelService.confirmBottomSheet();
  }
}
