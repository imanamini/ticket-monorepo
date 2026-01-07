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
import {CAndPPayService} from "../c-and-p-pay.service";
import {PageEnum} from "../../../enums/page.enum";
import {WalletApiService} from "../../../../../api/wallet-api.service";

@Component({
  selector: 'app-c-and-p-valid-amount',
  templateUrl: './c-and-p-valid-amount.component.html',
  styleUrls: ['./c-and-p-valid-amount.component.scss']
})
export class CAndPValidAmountComponent implements OnInit {
  public cardConfig: CardConfigInterface = CASH_IN_AND_PAY_CARD_CONFIG;
  public ticketInfoService = inject(TicketInfoService);
  private activatedRoute = inject(ActivatedRoute);
  private featureInformationService = inject(FeatureInformationService);
  public featureInformation: TgsSelectFeatureResponse;
  public urlService = inject(UrlService)
  public cashInBackService = inject(CashInBackService);
  private cAndPPayService = inject(CAndPPayService);
  private walletApi = inject(WalletApiService);
  public isValidChargeableAmount: boolean = true;

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }

  async ngOnInit() {
    this.createCashInInitiateFlag();
    const selectedFeatureName: number = Number(UpgFeatureName[this.activatedRoute.snapshot.queryParams['method']]);
    this.featureInformation = await this.featureInformationService.getLatestSelectedFeatureInfo(selectedFeatureName);
    this.checkValidationChargeableAmount();
  }

  public cashIn(): void {
    this.cAndPPayService.navigateToPay(this.featureInformation.payUrl);
  }

  public back(): void {
    const page: PageEnum = this.activatedRoute.snapshot.queryParams['page'];
    this.cashInBackService.backBasedOnScreen(page, this.isValidChargeableAmount)
  }

  private checkValidationChargeableAmount(): void {
    this.isValidChargeableAmount = (this.featureInformation.amount - this.featureInformation.walletBalance) >= this.featureInformation.cashInAmount;
  }

  private createCashInInitiateFlag(): void {
    this.walletApi.walletFlag(this.ticketInfoService.ticket , 'ICP').subscribe();
  }
}
