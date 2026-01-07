import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CardConfigInterface } from '../../data-access/models/card-config.interface';
import { CASH_IN_AND_PAY_CARD_CONFIG } from '../../data-access/consts/cash-in-and-pay-card-config';
import { ActivatedRoute } from '@angular/router';
import { FeatureInformationService } from '../../data-access/services/feature-information.service';
import * as Sentry from '@sentry/angular-ivy';
import { UserCardHintService } from './user-card-hint/user-card-hint.service';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { CardComponent } from '../card/card.component';
import { TicketInfoService } from '@client-monorepo/payment/checkout';
import { WalletApiService } from '@client-monorepo/payment/wallet';
import { HandleErrorService } from '../../data-access/services/handle-error.service';
import { TgsSelectFeatureResponse } from '../../data-access/models/tgs-select-feature-response';
import { formatPriceToString } from '@client-monorepo/common/utilities';
import { ApiResultInterface } from '@client-monorepo/common/network';
import { ActionHandlerService, ActionType, APP_ACTIONS, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { CommonModule } from '@angular/common';
import { UserCardHintComponent } from './user-card-hint/user-card-hint.component';
import { HintComponent } from './hint/hint.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { UserCardHintTooltipService } from './user-card-tooltip/user-card-hint-tooltip.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'payment-checkout-cash-in-and-pay',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    UserCardHintComponent,
    HintComponent,
    UiFormFieldBuilderModule,
    PipesModule,
    DpIconComponent,
    NgxTooltipDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './cash-in-and-pay.component.html',
  styleUrls: ['./cash-in-and-pay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashInAndPayComponent implements OnInit {
  @ViewChild('redirectPaymentForm', { static: false })
  redirectPaymentForm!: ElementRef<HTMLFormElement>;
  public tomanAmount = '';
  public cardConfig: CardConfigInterface = CASH_IN_AND_PAY_CARD_CONFIG;
  public ticketInfoService = inject(TicketInfoService);
  private walletApiService = inject(WalletApiService);
  private activatedRoute = inject(ActivatedRoute);
  private handleErrorService = inject(HandleErrorService);
  private featureInformationService = inject(FeatureInformationService);
  private formBuilder = inject(FormBuilder);
  private selectedFeatureName!: number;
  public info = signal<TgsSelectFeatureResponse | undefined>(undefined);
  loadingSubmit = signal(false);
  cardHintText = computed(() => this.userCardHintTooltipService.createText(this.info()!) ?? '');
  form = computed(() =>
    this.formBuilder.group({
      amount: [this.info()?.amount],
    }),
  );
  public userCardHintAlreadyRead: boolean | undefined;
  public userCardHintWasRead!: boolean;
  private userCardHintService = inject(UserCardHintService);
  private ngxHybridService = inject(NgxHybridServiceService);
  actionHandlerService = inject(ActionHandlerService);
  private userCardHintTooltipService = inject(UserCardHintTooltipService);
  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  async ngOnInit() {
    this.createCashInInitiateFlag();
    this.getSelectedFeatureName();
    const featureInfo = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName);
    this.info.set(featureInfo);
    const chargeableAmount = this.info()!.rawAmount! < this.info()!.cashInXferMin! ? this.info()?.cashInXferMin : this.info()?.rawAmount;
    this.tomanAmount = formatPriceToString(chargeableAmount || 0);
    this.userCardHintAlreadyRead = this.userCardHintService.getState();
  }

  public cashIn(): void {
    this.walletApiService.checkForCashInInput(this.info()!.amount, this.ticketInfoService.ticket()).subscribe(
      () => {
        if (this.ngxHybridService.isHybrid()) {
          this.openWindowWithPostData();
        } else {
          this.actionHandlerService.handle({
            type: ActionType.REDIRECT,
            payload: { url: this.info()!.payUrl, type: RedirectionTypeEnum.self },
          });
        }
      },
      (error: ApiResultInterface) => {
        this.handleErrorService.check(error);
      },
    );
  }

  private openWindowWithPostData() {
    const mapForm = document.createElement('form');
    mapForm.target = '_blank';
    mapForm.method = 'POST';
    mapForm.action = this.info()!.payUrl;

    const mapInput = document.createElement('input');
    mapInput.type = 'text';
    mapInput.name = 'amount';
    const info = this.info(); // Store the result of this.info()
    mapInput.value =
      info?.rawAmount && info?.cashInXferMin && info.rawAmount < info.cashInXferMin
        ? info.cashInXferMin.toString()
        : info?.rawAmount?.toString() || ''; // Default to empty string if undefined or null
    mapForm.appendChild(mapInput);

    document.body.appendChild(mapForm);

    const map = window.open(this.info()?.payUrl, '_blank');

    if (map) {
      mapForm.submit();
    } else {
      alert('لطفا به مرورگر اجازه انتقال به درگاه را بدهید.');
    }
  }

  private getSelectedFeatureName(): void {
    this.selectedFeatureName = Number(APP_ACTIONS[this.activatedRoute.snapshot.queryParams['method']]);
  }

  public onHintWasRead(): void {
    this.userCardHintWasRead = true;
  }

  private createCashInInitiateFlag(): void {
    this.walletApiService.walletFlag(this.ticketInfoService.ticket(), 'CahInAndPay').subscribe();
  }
}
