import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { WalletManagementApiService } from '../../data-access/services/wallet-management-api.service';
import { CashbackMerchantCardComponent } from '../../components/cashback-merchant-card/cashback-merchant-card.component';
import { finalize, map } from 'rxjs';
import { BalancesInterface } from '../../data-access/models/balance.interface';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'wallet-mng-applet-cashback-list',
  standalone: true,
  imports: [PageLayoutComponent, CashbackMerchantCardComponent, NgxSkeletonLoadingComponent],
  templateUrl: './cashback-list.component.html',
  styleUrl: './cashback-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WalletManagementApiService],
})
export class CashbackListComponent implements OnInit {
  private readonly api = inject(WalletManagementApiService);
  public cashbackList = signal<BalancesInterface[]>([]);
  public loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getCashbackData();
  }

  private getCashbackData() {
    this.loading.set(true);
    this.api
      .getBalances()
      .pipe(
        finalize(() => this.loading.set(false)),
        map((data) => data.balances.filter((item) => item.restriction?.businessIds?.length > 0)),
      )
      .subscribe({
        next: (data) => {
          this.cashbackList.set(data);
        },
      });
  }
}
