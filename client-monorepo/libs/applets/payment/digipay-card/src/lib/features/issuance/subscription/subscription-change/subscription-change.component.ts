import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxCard } from '@digipay/ngx-card';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { CashInAndPaymentConfirmationComponent } from '../../../../components/cash-in-and-payment-confirmation/cash-in-and-payment-confirmation.component';
import { TermsComponent } from '../../../../components/terms/terms.component';
import { WalletWithdrawalConfirmationComponent } from '../../../../components/wallet-withdrawal-confirmation/wallet-withdrawal-confirmation.component';
import { LowerCasePipe } from '@angular/common';
import { PLANS_TYPE, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { subscriptionClassMapper } from '../../../../data-access/models/subs-class-mapper';
import { DigiCardIssuanceService } from '../../../../data-access/services/digi-card-issuance.service';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player, { AnimationItem } from 'lottie-web/build/player/lottie_light';

@Component({
  selector: 'digipay-card-subscription-change',
  standalone: true,
  imports: [
    NgxCard,
    PipesModule,
    NgxDividerComponent,
    DpIconComponent,
    ApiImageModule,
    NgxButtonComponent,
    NgxCalloutComponent,
    DpIconComponent,
    TermsComponent,
    CashInAndPaymentConfirmationComponent,
    WalletWithdrawalConfirmationComponent,
    NgxAppBarComponent,
    LowerCasePipe,
    NgxDividerComponent,
    LottieComponent
  ],
     providers: [
      AnimationLoader,
      provideLottieOptions({
        player: () => player,
      }),
    ],
  templateUrl: './subscription-change.component.html',
  styleUrl: './subscription-change.component.scss',
})
export class SubscriptionChangeComponent implements OnInit {
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  digiCardIssuanceService = inject(DigiCardIssuanceService);
  router = inject(Router);

  currentPlan = computed<SubscriptionPlan | null>(() => {
    return this.digiCardIssuanceService.userPlan();
  });
  requiredPlans = computed<SubscriptionPlan[]>(() => {
    return this.digiCardIssuanceService.requiredPlans() || [];
  });

  plansTypeEnum = PLANS_TYPE;
  BorderColorsEnum = BorderColorsEnum;
  animationPath = 'assets/digipay-card/digi-card-shining.json';
  private anim: AnimationItem | null = null;

  subscriptionClassMapper = subscriptionClassMapper;
  ngOnInit(): void {
    this.checkPlansExistence();
  }
  checkPlansExistence() {
    if (!this.digiCardIssuanceService.requiredPlans() || !this.digiCardIssuanceService.userPlan()) {
      this.router.navigateByUrl('card/issuance');
    }
  }
  goBack() {
    this.router.navigate(['/transactions']);
  }
  
    animationCreated(animation: AnimationItem) {
      this.anim = animation;
      this.anim.setSpeed(0.5)
    }
  getPlans() {
    if (!this.digiCardIssuanceService.requiredPlans()) {
      this.router.navigateByUrl('/card/issuance');
      return;
    }
  }

  onNavigate() {
    this.bottomSheetService.openBottomSheet(WalletWithdrawalConfirmationComponent, {}, { disableClose: false });
  }
  onCancel() {
    this.router.navigateByUrl('/transactions');
  }
  onManageSubscription() {
    this.router.navigateByUrl('/subscription/subscription-management');
  }
}
