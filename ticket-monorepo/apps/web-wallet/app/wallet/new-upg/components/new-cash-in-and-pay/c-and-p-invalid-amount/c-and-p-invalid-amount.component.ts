import {Component, inject, OnInit} from '@angular/core';
import {CardConfigInterface} from "../../card/card-config.interface";
import {CASH_IN_AND_PAY_CARD_CONFIG} from "../../cash-in-and-pay/consts/cash-in-and-pay-card-config";
import {TicketInfoService} from "../../../services/ticket-info.service";
import {ActivatedRoute} from "@angular/router";
import {FeatureInformationService} from "../../payment-method/services/feature-information.service";
import {TgsSelectFeatureResponse} from "../../../../../api/models/tgs-select-feature-response";
import {UrlService} from "../../../services/url.service";
import {CashInBackService} from "../cash-in-back.service";
import * as Sentry from "@sentry/angular-ivy";
import {UpgFeatureName} from "../../../../../api/emuns/upg-feature-name.emun";
import {TGS_PROTECTION_STATE} from "../../../../../api/emuns/tgs-protection-state.enum";
import {CAndPPayService} from "../c-and-p-pay.service";
import {PaymentMethodService} from "../../payment-method/services/payment-method.service";
import {PageEnum} from "../../../enums/page.enum";
import {PageManagementService} from "../../../services/page-management.service";
import {TgsTicketInfoResponse, TicketInfoFeature} from "../../../../../api/models/tgs-ticket-info.response";
import {WalletApiService} from "../../../../../api/wallet-api.service";

@Component({
  selector: 'app-c-and-p-invalid-amount',
  templateUrl: './c-and-p-invalid-amount.component.html',
  styleUrls: ['./c-and-p-invalid-amount.component.scss']
})
export class CAndPInvalidAmountComponent implements OnInit {
  public cardConfig: CardConfigInterface = CASH_IN_AND_PAY_CARD_CONFIG;
  public ticketInfoService = inject(TicketInfoService);
  private activatedRoute = inject(ActivatedRoute);
  private featureInformationService = inject(FeatureInformationService);
  public featureInformation: TgsSelectFeatureResponse;
  public urlService = inject(UrlService)
  public cashInBackService = inject(CashInBackService);
  public isValidChargeableAmount: boolean = true;
  private CAndPPayService = inject(CAndPPayService);
  private paymentMethodService = inject(PaymentMethodService);
  private pageManagementService = inject(PageManagementService);
  private walletApi = inject(WalletApiService);
  public selectedFeature: TicketInfoFeature;

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }

  async ngOnInit() {
    this.createCashInInitiateFlag();
    this.ticketInfoService.get().then(async (ticketInfo: TgsTicketInfoResponse) => {
      const selectedFeatureName: number = Number(UpgFeatureName[this.activatedRoute.snapshot.queryParams['method']]);
      this.featureInformation = await this.featureInformationService.getLatestSelectedFeatureInfo(selectedFeatureName);
      this.selectedFeature = this.paymentMethodService.findSelectedFeature(ticketInfo.features, UpgFeatureName[selectedFeatureName]);
      this.checkValidationChargeableAmount();
    }).catch(() => {
      console.log('حطایی رخ داده است!')
    })
  }

  public cashIn(): void {
    switch (this.selectedFeature.protectionState) {
      case TGS_PROTECTION_STATE.NONE:
        this.CAndPPayService.navigateToPay(this.featureInformation.payUrl);
        break;
      case TGS_PROTECTION_STATE.PIN:
        this.pageManagementService.implement(PageEnum.CPPIN);
        break;
      case TGS_PROTECTION_STATE.OTP:
        this.pageManagementService.implement(PageEnum.CPOTP);
        break;
    }
  }

  public back(): void {
    const page: PageEnum = this.activatedRoute.snapshot.queryParams['page'];
    this.cashInBackService.backBasedOnScreen(page , this.isValidChargeableAmount)
  }

  private checkValidationChargeableAmount(): void {
    this.isValidChargeableAmount = (this.featureInformation.amount - this.featureInformation.walletBalance) >= this.featureInformation.cashInAmount;
  }

  private createCashInInitiateFlag(): void {
    this.walletApi.walletFlag(this.ticketInfoService.ticket , 'ICP').subscribe();
  }


  protected readonly TGS_PROTECTION_STATE = TGS_PROTECTION_STATE;
}
