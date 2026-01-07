import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CardConfigInterface} from '../card/card-config.interface';
import {TicketInfoService} from '../../services/ticket-info.service';
import {CASH_IN_AND_PAY_CARD_CONFIG} from './consts/cash-in-and-pay-card-config';
import {UpgFeatureName} from '../../../../api/emuns/upg-feature-name.emun';
import {ActivatedRoute} from '@angular/router';
import {HandleErrorService} from '../../services/handle-error.service';
import {ApiResult} from '../../../../api/models/api-result';
import {FeatureInformationService} from '../payment-method/services/feature-information.service';
import {TgsSelectFeatureResponse} from '../../../../api/models/tgs-select-feature-response';
import {WalletApiService} from "../../../../api/wallet-api.service";
import * as Sentry from "@sentry/angular-ivy";
import {UserCardHintService} from "./user-card-hint/user-card-hint.service";
import {TomanConvertor} from "../../utils/toman-convertor";
import {NavigateToExternalUrl} from "../../../../utils/navigation";
import {NgxHybridServiceService} from "@digipay/ngx-hybrid-service";

@Component({
  selector: 'app-cash-in-and-pay',
  templateUrl: './cash-in-and-pay.component.html',
  styleUrls: ['./cash-in-and-pay.component.scss']
})
export class CashInAndPayComponent implements OnInit {
  @ViewChild('redirectPaymentForm', {static: false})
  redirectPaymentForm: ElementRef<HTMLFormElement>;
  public tomanAmount: string;
  public cardConfig: CardConfigInterface = CASH_IN_AND_PAY_CARD_CONFIG;
  public loadingSubmit: boolean = false;
  public ticketInfoService = inject(TicketInfoService);
  private walletApiService = inject(WalletApiService);
  private activatedRoute = inject(ActivatedRoute);
  private handleErrorService = inject(HandleErrorService);
  private featureInformationService = inject(FeatureInformationService);
  private selectedFeatureName: number;
  public info: TgsSelectFeatureResponse;

  public userCardHintAlreadyRead: boolean;
  public userCardHintWasRead: boolean;
  private userCardHintService = inject(UserCardHintService);
  private ngxHybridService = inject(NgxHybridServiceService);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }

  async ngOnInit() {
    this.createCashInInitiateFlag();
    this.getSelectedFeatureName();
    this.info = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName);
    const chargeableAmount =
      (this.info.rawAmount < this.info.cashInXferMin) ? this.info.cashInXferMin : this.info.rawAmount;
    this.tomanAmount = TomanConvertor(chargeableAmount);
    this.userCardHintAlreadyRead = this.userCardHintService.getState();
  }

  public cashIn(): void {
    this.walletApiService.checkForCashInInput(this.info.amount, this.ticketInfoService.ticket)
      .subscribe(() => {
        if (this.ngxHybridService.isHybrid()) {
          this.openWindowWithPostData();
        } else {
          NavigateToExternalUrl(this.info.payUrl);
        }
      }, (error: ApiResult) => {
        this.handleErrorService.check(error);
      });
  }

  private openWindowWithPostData() {
    var mapForm = document.createElement("form");
    mapForm.target = "_blank";
    mapForm.method = "POST";
    mapForm.action = this.info.payUrl;

    var mapInput = document.createElement("input");
    mapInput.type = "text";
    mapInput.name = "amount";
    mapInput.value = (this.info?.rawAmount < this.info?.cashInXferMin) ? this.info?.cashInXferMin.toString() : this.info?.rawAmount.toString();
    mapForm.appendChild(mapInput);

    document.body.appendChild(mapForm);

    const map = window.open(this.info.payUrl, '_blank');

    if (map) {
      mapForm.submit();
    } else {
      alert('لطفا به مرورگر اجازه انتقال به درگاه را بدهید.');
    }
  }

  private getSelectedFeatureName(): void {
    this.selectedFeatureName = Number(UpgFeatureName[this.activatedRoute.snapshot.queryParams['method']]);
  }

  public onHintWasRead(): void {
    this.userCardHintWasRead = true;
  }

  private createCashInInitiateFlag(): void {
    this.walletApiService.walletFlag(this.ticketInfoService.ticket , 'CahInAndPay').subscribe();
  }
}
