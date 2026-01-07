import { Component, inject, OnInit } from '@angular/core';
import { WALLET_PAY_CARD_CONFIG } from './consts/wallet-card-config';
import { CardConfigInterface } from '../card/card-config.interface';
import { TicketInfoService } from '../../services/ticket-info.service';
import { PayByWalletService } from './pay-by-wallet.service';
import { ActivatedRoute } from '@angular/router';
import { UpgFeatureName } from '../../../../api/emuns/upg-feature-name.emun';
import { UserDetail } from '../../../../api/models/tac.response';
import { UserInformationService } from '../../services/user-information.service';
import { FeatureInformationService } from '../payment-method/services/feature-information.service';
import { TgsSelectFeatureResponse } from '../../../../api/models/tgs-select-feature-response';
import * as Sentry from "@sentry/angular-ivy";

@Component({
  selector: 'app-wallet-pay',
  templateUrl: './wallet-pay.component.html',
  styleUrls: ['./wallet-pay.component.scss']
})
export class WalletPayComponent implements OnInit {
  public cardConfig: CardConfigInterface = WALLET_PAY_CARD_CONFIG;
  public loadingSubmit: boolean = false;
  public ticketInfoService = inject(TicketInfoService);

  public payByWalletService = inject(PayByWalletService);
  private userService = inject(UserInformationService);
  public user: UserDetail;
  private activatedRoute = inject(ActivatedRoute);
  public selectedFeatureName: number;
  public info: TgsSelectFeatureResponse;
  private featureInformationService = inject(FeatureInformationService);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }
  async ngOnInit() {
    this.getSelectedFeatureName();
    this.info = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName);
    this.user = await this.userService.get();
  }

  private getSelectedFeatureName(): void {
    this.selectedFeatureName = Number(UpgFeatureName[this.activatedRoute.snapshot.queryParams['method']]);
  }
}
