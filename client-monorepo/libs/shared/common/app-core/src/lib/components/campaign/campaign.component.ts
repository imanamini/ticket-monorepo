import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StorageService } from '@client-monorepo/common/utilities';
import { AssetTypes, UserAssetResponseModel, UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { PaymentType, TransactionApiResponse, TransactionsApiService } from '@client-monorepo/payment/transactions';
import moment from 'jalali-moment';
import { timeout } from 'rxjs/operators';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'lib-campaign',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  userService = inject(StorageService);
  assetsApiService = inject(UserAssetsApiService);
  transactionsApiService = inject(TransactionsApiService);
  day = moment().locale('fa').jDate();
  currentQueryParams!: Params;
  ngOnInit() {
    this.initCampaignRedirection();
    this.currentQueryParams = this.route.queryParams;
  }

  navigateToTarget = (targetRoute: string) => {
    this.router.navigate([targetRoute], { queryParams: this.currentQueryParams });
  };

  initCampaignRedirection(): void {
    let target = 'hub';
    const creditIds: Array<string> = [];

    if (this.day >= 1 && this.day <= 5 && this.userService.isLoggedIn()) {
      this.assetsApiService
        .getUserAssets()
        .pipe(
          timeout(4000),
          switchMap((assets: UserAssetResponseModel) => {
            const hasBnpl = assets.assets.some((asset) => {
              if (asset.type === AssetTypes.BNPL) {
                if ('balance1Pay' in asset) {
                  return Number(asset.balance1Pay) > 0;
                }
                if ('balance4Pay' in asset) {
                  return Number(asset.balance4Pay) > 0;
                }
                return false;
              }
              return false;
            });
            if (hasBnpl) {
              assets.assets.forEach((asset) => {
                if ([AssetTypes.BNPL_1PAY, AssetTypes.BNPL_4PAY].indexOf(asset.type) !== -1) {
                  if ('creditId' in asset) {
                    creditIds.push(asset.creditId as string);
                  }
                }
              });
              return this.transactionsApiService.getUpcomingInstallmentTransactions().pipe(timeout(4000));
            } else {
              return of(null);
            }
          }),
        )
        .subscribe({
          next: (transactions: TransactionApiResponse | null) => {
            if (transactions) {
              if (transactions.paymentList.length) {
                const hasBnplInstallment = transactions.paymentList.some((payment) => {
                  if (payment.paymentType === PaymentType.INSTALLMENT) {
                    if ('creditId' in payment.payload && creditIds.indexOf(payment.payload.creditId) !== -1) {
                      return true;
                    }
                  }
                  return false;
                });
                if (hasBnplInstallment) {
                  this.navigateToTarget(target);
                } else {
                  target = 'stores';
                  this.navigateToTarget(target);
                }
              } else {
                target = 'stores';
                this.navigateToTarget(target);
              }
            } else {
              this.navigateToTarget(target);
            }
          },
          error: () => {
            this.navigateToTarget(target);
          },
        });
    } else {
      this.navigateToTarget(target);
    }
  }
}
