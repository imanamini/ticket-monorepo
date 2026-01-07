import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabConfig, TabGroupComponent } from '@client-monorepo/common/ui-components';
import { WalletTransferComponent } from '../../components/wallet-transfer-module/wallet-transfer/wallet-transfer.component';
import { CashOutToCardComponent } from '../../components/cash-out-to-card/cash-out-to-card.component';

@Component({
  selector: 'cash-out-applet-main-cash-out',
  standalone: true,
  imports: [CommonModule, TabGroupComponent],
  templateUrl: './cash-out.component.html',
  styleUrl: './cash-out.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCashOutComponent implements OnInit {
  activeTab = signal<'card' | 'wallet'>('wallet');
  tabs!: Array<TabConfig>;

  ngOnInit(): void {
    this.populateTabConfig();
  }

  private populateTabConfig() {
    this.tabs = [
      {
        label: signal('انتقال به کارت'),
        isActive: signal(true),
        component: signal(CashOutToCardComponent),
      },
      {
        label: signal('انتقال به کیف'),
        isActive: signal(false),
        component: signal(WalletTransferComponent),
      },
    ];
  }
}
