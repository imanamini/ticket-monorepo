import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxCard } from '@digipay/ngx-card';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { CashInAndPaymentConfirmationComponent } from '../../../../components/cash-in-and-payment-confirmation/cash-in-and-payment-confirmation.component';
import { TermsComponent } from '../../../../components/terms/terms.component';
import { WalletWithdrawalConfirmationComponent } from '../../../../components/wallet-withdrawal-confirmation/wallet-withdrawal-confirmation.component';
import { LowerCasePipe } from '@angular/common';
import { PLANS_TYPE, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { DigiCardIssuanceService } from '../../../../data-access/services/digi-card-issuance.service';
import { subscriptionClassMapper } from '../../../../data-access/models/subs-class-mapper';
import { MessageService } from '@client-monorepo/common/utilities';
import { TermsBoxComponent } from '../../../../components/terms-box/terms-box.component';
import { BackHandlerService } from '@client-monorepo/back-handler';
import player, { AnimationItem } from 'lottie-web/build/player/lottie_light';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';

@Component({
  selector: 'digipay-card-applet-subscription-active',
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
    TermsBoxComponent,
    LottieComponent,
  ],
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
  templateUrl: './subscription-active.component.html',
  styleUrl: './subscription-active.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionActiveComponent implements OnInit {
  //services
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  digiCardIssuanceService = inject(DigiCardIssuanceService);
  messageService = inject(MessageService);
  termsAccepted = signal<boolean>(false);
  backHandler = inject(BackHandlerService);
  private anim: AnimationItem | null = null;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  //signals
  calloutMessages = signal<string[]>([]);
  currentPlan = computed<SubscriptionPlan | null>(() => {
    return this.digiCardIssuanceService.userPlan();
  });

  //enums and mappers
  plansTypeEnum = PLANS_TYPE;
  subscriptionClassMapper = subscriptionClassMapper;
  animationPath = 'assets/digipay-card/digi-card-shining.json';

  ngOnInit(): void {
    this.checkUserPlanExistence();
  }
  openRulesAndConditions() {
    this.bottomSheetService.openBottomSheet(TermsComponent, { disableClose: false });
  }
  goBack() {
    const hasSubscriptionMng = Boolean(this.activatedRoute.snapshot.queryParams['src']);

    const fallbackUrl = hasSubscriptionMng ? '/subscription/subscription-management' : '/transactions';

    this.backHandler.setCustomBackUrl(fallbackUrl, true);
    this.backHandler.goBack();
  }

  approvePlan() {
    this.digiCardIssuanceService.confirmPlan().subscribe({
      next: (res) => {
        this.router.navigateByUrl('/card/issuance');
      },
      error: (err) => {
        this.messageService.showErrorMessage(err?.error?.result?.message);
      },
    });
  }
  checkUserPlanExistence() {
    if (!this.digiCardIssuanceService.userPlan()) {
      this.router.navigateByUrl('/card/issuance');
    }
  }
  animationCreated(animation: AnimationItem) {
    this.anim = animation;
    this.anim.setSpeed(0.5);
  }
  approveTerms(approve: boolean) {
    this.termsAccepted.set(approve);
  }
}
