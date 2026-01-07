import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { TicketTypes } from '../../../../api/digipay/models/payment/ticket-types';
import { FineApiService } from './fine-api.service';
import { PaymentGateways } from '../../../../api/digipay/models/tac/payment-gateways';
import { WalletApiService } from '../../../../api/digipay/wallet-api.service';
import { MatDialog } from '@angular/material/dialog';
import { UiDialogPaymentResultComponent } from '../../../../ui/ui-components/ui-dialogs/ui-dialog-payment-result/ui-dialog-payment-result.component';
import { PaymentResultDialogData } from '../../../../ui/ui-components/ui-dialogs/ui-dialog-payment-result/models/payment-result-dialog-data';
import { Router } from '@angular/router';
import { PaymentResultStatus } from '../../../../api/digipay/models/payment/payment-result';
import { FeatureCodes } from '../../../../api/digipay/models/payment/payment-feature';
import { PaymentFeaturesResponse } from '../../../../api/digipay/models/payment/payment-features-response';
import { PaymentSelectFeatureResponse } from '../../../../api/digipay/models/payment/payment-select-feature-response';
import {isPlatformBrowser} from "@angular/common";

@Injectable()
export class FinePaymentService {
  paymentStep: string;

  walletPayUrl: string;

  walletShortageHandler: (selectFeatureResponse: PaymentSelectFeatureResponse) => {};

  constructor(
    private fineApiService: FineApiService,
    private walletApi: WalletApiService,
    private matDialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  initiate(
    walletShortageHandler: (selectFeatureResponse: PaymentSelectFeatureResponse) => {},
    walletPayUrl: string,
    paymentStep: 'inquiry' | 'fine',
  ) {
    this.walletPayUrl = walletPayUrl;
    this.walletShortageHandler = walletShortageHandler;
    this.paymentStep = paymentStep;
  }

  pay(selectedGateway: PaymentGateways, ticketType: TicketTypes, request: any) {
    this.fineApiService.getTicket(ticketType, request).subscribe((res) => {
      this.fineApiService.getFeatures(res.ticket).subscribe((featuresResponse: PaymentFeaturesResponse) => {
        if (selectedGateway === PaymentGateways.IPG && featuresResponse.features.find((feature) => feature.name == FeatureCodes.IPG)) {
          this.payByIPG({
            ticket: res.ticket,
            featureName: FeatureCodes.IPG,
          });
        } else if (
          selectedGateway === PaymentGateways.WALLET &&
          featuresResponse.features.find((feature) => feature.name == FeatureCodes.WALLET_CASH_IN)
        ) {
          this.fineApiService
            .selectPaymentFeature({
              ticket: res.ticket,
              featureName: FeatureCodes.WALLET_CASH_IN,
            })
            .subscribe((selectFeatureResponse: PaymentSelectFeatureResponse) => {
              this.walletShortageHandler(selectFeatureResponse);
            });
        } else if (
          selectedGateway === PaymentGateways.WALLET &&
          featuresResponse.features.find((feature) => feature.name == FeatureCodes.WALLET)
        ) {
          this.fineApiService
            .selectPaymentFeature({
              ticket: res.ticket,
              featureName: FeatureCodes.WALLET,
            })
            .subscribe((_) => {
              this.payByWallet(res.ticket);
            });
        }
      });
    });
  }

  payByWallet(ticket: string) {
    this.walletApi.payByWallet(this.walletPayUrl, ticket).subscribe((result) => {
      const tempArray = [];
      for (const key in result.activityInfo) {
        const tmpKey = Object.keys(result.activityInfo[key])[0];
        tempArray.push({
          key: tmpKey,
          value: result.activityInfo[key][tmpKey],
        });
      }
      result.activityInfo = tempArray;
      this.matDialog
        .open(UiDialogPaymentResultComponent, {
          width: '450px',
          maxWidth: '90%',
          panelClass: ['ui-dialog-container', 'ui-payment-dialog-container'],
          data: {
            paymentResult: result,
            statusKey: this.paymentStep + 'PaymentStatus',
          } as PaymentResultDialogData,
        })
        .afterClosed()
        .subscribe(() => {
          if (result.paymentResult === PaymentResultStatus.SUCCESS) {
            this.router.navigate([], {
              queryParams: {
                fineTrackingCode: result.trackingCode,
                step: this.paymentStep,
              },
            });
          }
        });
    });
  }

  payByIPG(selectedFeature: { ticket: string; featureName: FeatureCodes }) {
    if(isPlatformBrowser(this.platformId)) {
      this.fineApiService.selectPaymentFeature(selectedFeature).subscribe((selectFeatureResponse) => {
        window.location.href = selectFeatureResponse.payUrl;
      });
    }

  }
}
