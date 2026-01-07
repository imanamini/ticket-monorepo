import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashOutRemainingChartComponent } from '../cash-out-remaining-chart/cash-out-remaining-chart.component';
import { WalletInfoResponse } from '../../data-access/models/wallet-info-response.model';

@Component({
  selector: 'cash-out-applet-cash-out-detail',
  standalone: true,
  imports: [CommonModule, CashOutRemainingChartComponent],
  templateUrl: './cash-out-detail.component.html',
  styleUrl: './cash-out-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashOutDetailComponent {
  data = input.required<WalletInfoResponse | null>();
  radius = input(60);
  stroke = input(15);
  progress = computed(() => {
    const { dailyTotalCashOutAmount = 0, dailyCapAmount = 0 } = this.data() || {};
    const result = ((dailyCapAmount - dailyTotalCashOutAmount) * 100) / dailyCapAmount;
    return Number(result.toFixed(2)) || 0;
  });
}
