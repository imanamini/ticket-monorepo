import { Component, input, OnInit, signal } from '@angular/core';
import { MatProgressBar, MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { CalculateRemainingInventoryPercent } from './calculate-remaining-inventory-percent';
import { VoucherDetail } from '../../../data-access/models/voucher.response.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'wallet-mng-applet-gift-information',
  templateUrl: './gift-information.component.html',
  styleUrls: ['./gift-information.component.scss'],
  imports: [PipesModule, MatProgressBarModule, MatProgressBar, NgxTooltipDirective],
  standalone: true,
})
export class GiftInformationComponent implements OnInit {
  state = input.required<VoucherDetail>();
  public mode: ProgressBarMode = 'determinate';
  public remainingAmountPercentage = signal<number | null>(null);

  ngOnInit(): void {
    this.remainingAmountPercentage.set(CalculateRemainingInventoryPercent(this.state().balance, this.state().amount));
  }
}
