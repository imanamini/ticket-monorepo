// redirect.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import moment from 'jalali-moment';
import { InitiatorService, StorageService } from '@client-monorepo/common/utilities';
import { AssetTypes, UserAssetResponseModel, UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { of, switchMap } from 'rxjs';
import { TransactionApiResponse, TransactionsApiService } from '@client-monorepo/payment/transactions';
import { PaymentType } from '@client-monorepo/payment/transactions';
import { timeout } from 'rxjs/operators';

export const campaginGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const userService = inject(StorageService);
  const assetsApiService = inject(UserAssetsApiService);
  const transactionsApiService = inject(TransactionsApiService);
  const initiatorService = inject(InitiatorService);
  const day = moment().locale('fa').jDate();
  let target = 'hub';
  const creditIds: Array<string> = [];
  const currentQueryParams = route.queryParams;

  return new Promise<boolean>((resolve, reject) => {
    const navigateToTarget = (targetRoute: string) => {
      router.navigate([targetRoute], { queryParams: currentQueryParams });
    };

    if (day >= 1 && day <= 5 && userService.isLoggedIn()) {
      assetsApiService
        .getUserAssets()
        .pipe(
          timeout(2000),
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
              return transactionsApiService.getUpcomingInstallmentTransactions().pipe(timeout(2000));
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
                  navigateToTarget(target);
                  resolve(false);
                } else {
                  initiatorService.mainRoute = 'stores';
                  target = 'stores';
                  navigateToTarget(target);
                  resolve(false);
                }
              } else {
                initiatorService.mainRoute = 'stores';
                target = 'stores';
                navigateToTarget(target);
                resolve(false);
              }
            } else {
              navigateToTarget(target);
              resolve(false);
            }
          },
          error: () => {
            resolve(true);
          },
        });
    } else {
      navigateToTarget(target);
      resolve(false);
    }
  });
};
