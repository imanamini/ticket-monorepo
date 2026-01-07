import { Component, computed, inject, signal } from '@angular/core';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { IplService } from '../../services/ipl.service';
import { IplDetailService } from '../../services/ipl-detail/ipl-detail.service';
import { IplPayService } from '../../services/ipl-pay/ipl-pay.service';
import { IplHeaderComponent } from '../ipl-header/ipl-header.component';
import { IplDetailAggregateComponent } from './ipl-detail-aggregate/ipl-detail-aggregate.component';
import { DebtorInfoComponent } from './debtor-info/debtor-info.component';
import { IplDetailTotalDebtComponent } from './ipl-detail-total-debt/ipl-detail-total-debt.component';

@Component({
  selector: 'ipl-detail',
  standalone: true,
  imports: [IplHeaderComponent, IplDetailAggregateComponent, DebtorInfoComponent, NgxCalloutComponent, IplDetailTotalDebtComponent],
  templateUrl: './ipl-detail.component.html',
  styleUrl: './ipl-detail.component.scss',
})
export class IplDetailComponent {
  // Services
  private iplService = inject(IplService);
  public iplDetailService = inject(IplDetailService);
  private iplPayService = inject(IplPayService);

  // Signals
  userInfo = signal(this.iplService.userInfo()!);
  emptyDebt = computed<boolean>(() => this.userInfo().totalDebt === 0);

  constructor() {
    this.iplDetailService.setCanAggregate(this.userInfo().unPaidInstallments && this.userInfo().unPaidInstallments.length > 0);
    this.iplDetailService.setPersonInfo(this.userInfo().fullName, this.userInfo().cellNumber);
  }

  goToApp() {
    this.iplDetailService.goToApp();
  }

  onPay() {
    this.iplPayService.pay();
  }
}
