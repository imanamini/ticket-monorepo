import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabConfig, TabGroupComponent } from '@client-monorepo/common/ui-components';
import { CreditStoresComponent } from '../credit-stores/credit-stores.component';
import { BnplStoresComponent } from '../bnpl-stores/bnpl-stores.component';

@Component({
  selector: 'stores-applet-stores-summary',
  standalone: true,
  imports: [CommonModule, TabGroupComponent],
  templateUrl: './stores-summary.component.html',
  styleUrl: './stores-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresSummaryComponent implements OnInit {
  tabs!: Array<TabConfig>;

  ngOnInit(): void {
    this.initializeTabConfig();
  }

  initializeTabConfig(): void {
    this.tabs = [
      {
        label: signal('خرید با وام'),
        isActive: signal(true),
        component: signal(CreditStoresComponent),
      },
      {
        label: signal('خرید اعتباری'),
        isActive: signal(false),
        component: signal(BnplStoresComponent),
      },
    ];
  }
}
