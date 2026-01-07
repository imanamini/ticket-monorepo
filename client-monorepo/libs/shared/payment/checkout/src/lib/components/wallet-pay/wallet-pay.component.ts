import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { WALLET_PAY_CARD_CONFIG } from '../../data-access/consts/wallet-card-config';
import { CardConfigInterface } from '../../data-access/models/card-config.interface';
import { PayByWalletService } from '../../data-access/services/pay-by-wallet.service';
import { ActivatedRoute } from '@angular/router';
import { FeatureInformationService } from '../../data-access/services/feature-information.service';
import * as Sentry from '@sentry/angular-ivy';
import { TicketInfoService } from '@client-monorepo/payment/checkout';
import { UserInformationService } from '../../data-access/services/user-information.service';
import { UserDetail } from '@client-monorepo/common/user';
import { TgsSelectFeatureResponse } from '../../data-access/models/tgs-select-feature-response';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { CardComponent } from '../card/card.component';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'payment-checkout-wallet-pay',
  standalone: true,
  imports: [CardComponent, PipesModule],
  templateUrl: './wallet-pay.component.html',
  styleUrls: ['./wallet-pay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPayComponent implements OnInit {
  public cardConfig: CardConfigInterface = WALLET_PAY_CARD_CONFIG;
  public loadingSubmit = false;
  public ticketInfoService = inject(TicketInfoService);

  public payByWalletService = inject(PayByWalletService);
  private userService = inject(UserInformationService);
  public user!: UserDetail;
  private activatedRoute = inject(ActivatedRoute);
  public selectedFeatureName!: number;
  public info!: TgsSelectFeatureResponse;
  private featureInformationService = inject(FeatureInformationService);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }
  async ngOnInit() {
    this.getSelectedFeatureName();
    this.info = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName);
    this.user = await this.userService.get();
  }

  private getSelectedFeatureName(): void {
    this.selectedFeatureName = Number(APP_ACTIONS[this.activatedRoute.snapshot.queryParams['method']]);
  }
}
