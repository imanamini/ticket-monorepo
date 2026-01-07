import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { WALLET_CREDIT_GUIDS } from '../../../../data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-get-credit-guids',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './get-credit-guids.component.html',
  styleUrl: './get-credit-guids.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetCreditGuidsComponent {
  buttonId = input.required<string>();
  walletId = input.required<string>();

  private activatedRouter = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);

  creditGuids() {
    const referrer = this.activatedRouter.snapshot.queryParams['referrer'];
    this.navigationService.navigate([WALLET_CREDIT_GUIDS, this.walletId()], {
      queryParams: {
        referrer,
      },
    });
  }
}
