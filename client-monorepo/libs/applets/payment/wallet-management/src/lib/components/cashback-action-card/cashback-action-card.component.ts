import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxIcon } from '@digipay/ngx-icon';
import { BalancesInterface } from '../../data-access/models/balance.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'wallet-mng-applet-cashback-action-card',
  standalone: true,
  imports: [NgxIcon, PipesModule],
  templateUrl: './cashback-action-card.component.html',
  styleUrl: './cashback-action-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashbackActionCardComponent {
  public vouchers = input.required<BalancesInterface[]>();
  public totalAmount = computed(() => this.vouchers()?.reduce((acc, curr) => acc + curr.balance, 0));
  private readonly router = inject(Router);

  onNavigateToList() {
    this.router.navigate(['wallet-management/cashback']);
  }
}
