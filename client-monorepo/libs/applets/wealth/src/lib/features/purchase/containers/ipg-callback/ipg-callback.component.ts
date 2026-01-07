import { catchError, of, takeUntil } from 'rxjs';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PurchaseService } from '../../services/purchase-service.service';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { GeneralOrderService } from '../../../../components/core/services/general-order.service';
import { paymentClientMetadataModel } from '../../../../components/core/models/payment-client-metadata.model';
import { RECEIPT_ROUTE, RESULT_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-ipg-callback',
  templateUrl: './ipg-callback.component.html',
  styleUrls: ['./ipg-callback.component.scss'],
  standalone: true,
  imports: [SpinnerComponent],
})
export class IpgCallbackComponent extends BaseComponent implements OnInit {
  metaData = signal<string | undefined>(undefined);
  refNumber = signal<string | undefined>(undefined);

  private purchaseService = inject(PurchaseService);
  private generalOrderService = inject(GeneralOrderService);
  private navigationService = inject(WealthNavigationService);

  constructor() {
    super();
  }

  ngOnInit() {
    const params = window.location.search.slice(1);
    const queryParams = new URL(document.location.toString()).searchParams;
    const orderId = queryParams.get('orderId');
    const checkAgent = queryParams.get('checkAgent');
    const authority = queryParams.get('Authority');
    const refNumber = queryParams.get('refNumber');
    const trackingCode = queryParams.get('trackingCode');
    this.refNumber.set(refNumber);
    /**
     * ? We checked Hybrid and redirect here again to continue
     */
    if (!checkAgent || checkAgent == 'false') {
      if (authority) {
        this.generalOrderService
          .paymentClientMetadata(authority, refNumber)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((paymentMetaData: paymentClientMetadataModel) => {
            if (paymentMetaData?.success) {
              this.metaData.set(paymentMetaData.result);
            }
            this.getOrderDetail(params);
          });
      } else if (trackingCode) {
        this.walletCachin(trackingCode);
      } else {
        this.checkAgent(orderId, params);
      }
    } else {
      this.checkAgent(orderId, params);
    }
  }

  private walletCachin(trackingCode: string) {
    this.navigationService.navigate([RECEIPT_ROUTE], {
      queryParams: {
        trackingCode: trackingCode,
      },
    });
  }

  /**
   * * We need to check if the agent is hybrid or not
   */
  private checkAgent(orderId: string, params: any) {
    this.generalOrderService
      .paymentClientMetadata(orderId, this.refNumber())
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((paymentMetaData: paymentClientMetadataModel) => {
        if (paymentMetaData?.success) {
          this.metaData.set(paymentMetaData.result);
        }
        if (paymentMetaData?.result?.includes('dgp://')) {
          // * Create an <a> element
          const link = document.createElement('a');
          link.href = `${paymentMetaData.result}?${params}&checkAgent=false`;
          document.body.appendChild(link);
          link.click();
        } else {
          this.getOrderDetail(params);
        }
      });
  }

  private getOrderDetail(params: any) {
    if (this.metaData()?.includes('type=CashIn')) {
      this.purchaseService
        .callbackCashinPayment(params)
        .pipe(
          catchError(() => {
            this.navigationService.navigate([RESULT_ROUTE], {
              queryParams: {
                isSuccess: 'false',
                action: 'cashin',
                receiptNumber: 0,
              },
            });
            return of(null);
          }),
          takeUntil(this.destroyObservable),
        )
        .subscribe((res) => {
          if (res?.success) {
            this.navigationService.navigate([RESULT_ROUTE], {
              queryParams: {
                isSuccess: res.result.isSuccess ? 'true' : 'false',
                action: 'cashin',
                receiptNumber: res.result.receiptNumber || 0,
              },
            });
          } else {
            this.navigationService.navigate([RESULT_ROUTE], {
              queryParams: {
                isSuccess: 'false',
                action: 'cashin',
                receiptNumber: 0,
              },
            });
          }
        });
    }
  }
}
