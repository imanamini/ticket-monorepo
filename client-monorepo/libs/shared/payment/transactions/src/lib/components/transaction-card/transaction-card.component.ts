import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionCard } from '../../data-access/models/transaction-card';
import { DEFAULTTRANSACTIONCARD } from '../../data-access/constants/transaction-card';
import { TransactionCardImageComponent } from '../transaction-card-image/transaction-card-image.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { Router } from '@angular/router';
import { ActionHandlerService, ActionType, SERVICE_ROUTES } from '@client-monorepo/common/action-handler';
import { InternetService } from '@client-monorepo/applets/internet';
import { FrequentBundlePayload, FrequentC2CPayload, UpcomingInstallmentPayload } from '../../data-access/models/payment';
import { MobileOperator } from '@client-monorepo/common/utilities';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { BillGeneralService, BillPayment } from '@client-monorepo/daily-fintech/bill';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CallbackInstallmentsOverviewKey } from '@client-monorepo/applets/credit';

@Component({
  selector: 'payment-transactions-transaction-card',
  standalone: true,
  imports: [CommonModule, TransactionCardImageComponent, PipesModule, NgxButtonComponent],
  templateUrl: './transaction-card.component.html',
  styleUrl: './transaction-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionCardComponent {
  config = input<TransactionCard>(DEFAULTTRANSACTIONCARD);
  clicked = output<TransactionCard>();
  doDefaultAction = input<boolean>(true);
  router = inject(Router);
  actionHandler = inject(ActionHandlerService);
  internetService = inject(InternetService);
  billService = inject(BillGeneralService);

  handleClick(): void {
    if (this.doDefaultAction()) {
      switch (this.config().type) {
        case 'history':
          this.redirectHistoryTransactions();
          break;
        case 'upcoming':
          this.redirectUpcomingTransactions();
          break;
        case 'frequent':
          this.redirectFrequentTransaction();
          break;
      }
    }
    this.clicked.emit(this.config());
  }

  redirectHistoryTransactions() {
    if (this.config().trackingCode) {
      const url = 'payment/transaction-result/' + this.config().id;
      this.actionHandler.handle({
        type: ActionType.REDIRECT,
        payload: {
          url,
        },
      });
    }
  }

  redirectUpcomingTransactions() {
    if (this.config().upcomingType === 'installment') {
      const installmentPayload: UpcomingInstallmentPayload = this.config().payload as UpcomingInstallmentPayload;
      if (installmentPayload) {
        this.actionHandler.handle({
          type: ActionType.PAY_INSTALLMENT,
          payload: {
            serviceType: installmentPayload.serviceType,
            creditId: installmentPayload.creditId,
            ticketDetail: installmentPayload.contractDebts.ticketDetail,
            params: {
              rfr: 'dpx-pay',
              [CallbackInstallmentsOverviewKey]: encodeURIComponent('/transactions'),
            },
          },
        });
      } else {
        this.actionHandler.handle({
          type: ActionType.REDIRECT,
          payload: {
            url: '/service/credit/wallet/detail/' + this.config().creditId,
          },
        });
      }
    } else if (this.config().upcomingType === 'bill') {
      this.billService.billClick(this.config().payload as BillPayment);
    }
  }

  redirectFrequentTransaction(): void {
    if (this.config().frequentType === 'bundle') {
      this.internetService.setPackageData({
        bundleId: (this.config().payload as FrequentBundlePayload).data.internetPackage.bundleId,
        amount: (this.config().payload as FrequentBundlePayload).data.internetPackage.amount,
        duration: (this.config().payload as FrequentBundlePayload).data.internetPackage.duration,
        description: (this.config().payload as FrequentBundlePayload).data.internetPackage.description,
        imageId: (this.config().payload as FrequentBundlePayload).data.operator.imageId,
        needApproval: (this.config().payload as FrequentBundlePayload).data.internetPackage.needApproval,
      });
      this.internetService.setConfirmData({
        bundleTitle: (this.config().payload as FrequentBundlePayload).data.internetPackage.description,
        operatorName: (this.config().payload as FrequentBundlePayload).data.operator.name,
        simType: (this.config().payload as FrequentBundlePayload).data.topUpRecommendation.cellNumberType.toString(),
        operatorId: (this.config().payload as FrequentBundlePayload).data.operator.operatorId,
        operator: (this.config().payload as FrequentBundlePayload).data.operator as MobileOperator,
        cellNumber: (this.config().payload as FrequentBundlePayload).data.topUpRecommendation.title,
      });
      const url = '/internet/confirm';
      this.actionHandler.handle({
        type: ActionType.REDIRECT,
        payload: {
          url,
        },
      });
    } else if (this.config().frequentType === 'c2c') {
      const url = SERVICE_ROUTES[FrequentServicesIdEnum.C2C];
      this.actionHandler.handle({
        type: ActionType.REDIRECT,
        payload: {
          url,
          params: {
            recommendation: (this.config().payload as FrequentC2CPayload).id,
          },
        },
      });
    }
  }
}
