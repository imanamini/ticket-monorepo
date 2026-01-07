import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PLANS_TYPE, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxCard } from '@digipay/ngx-card';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { SubscriptionCardComponent } from '../../../../components/subscription/subscription-card/subscription-card.component';
import { SubscriptionServicesBottomSheetComponent } from '../../../../components/subscription/subscription-service-bottom-sheet/subscription-services-bottom-sheet.component';
import { TermsComponent } from '../../../../components/terms/terms.component';
import { subscriptionClassMapper } from '../../../../data-access/models/subs-class-mapper';
import { DigiCardIssuanceService } from '../../../../data-access/services/digi-card-issuance.service';
import { TermsBoxComponent } from '../../../../components/terms-box/terms-box.component';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player, { AnimationItem } from 'lottie-web/build/player/lottie_light';

@Component({
  selector: 'digipay-card-applet-subscription-required',
  standalone: true,
  imports: [
    CommonModule,
    NgxCard,
    PipesModule,
    NgxDividerComponent,
    DpIconComponent,
    ApiImageModule,
    NgxButtonComponent,
    NgxCalloutComponent,
    DpIconComponent,
    TermsComponent,
    SubscriptionCardComponent,
    NgxAppBarComponent,
    TermsBoxComponent,
    LottieComponent
  ],
  templateUrl: './subscription-required.component.html',
  styleUrl: './subscription-required.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
      AnimationLoader,
      provideLottieOptions({
        player: () => player,
      }),
    ],
})
export class SubscriptionRequiredComponent {
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  digiCardIssuanceService = inject(DigiCardIssuanceService);
  termsAccepted = signal<boolean>(false);
  router = inject(Router);
  requiredPlans = computed<SubscriptionPlan[]>(() => {
    return this.digiCardIssuanceService.requiredPlans();
  });
  selectedPlan = signal<SubscriptionPlan | null>(null);

  calloutMessages = signal<string[]>([]);
  plansTypeEnum = PLANS_TYPE;
  subscriptionClassMapper = subscriptionClassMapper;
  animationPath = 'assets/digipay-card/digi-card-shining.json';
  private anim: AnimationItem | null = null;

  constructor() {
    effect(
      () => {
        const plans = this.requiredPlans();
        if (!plans || plans.length === 0) {
          this.router.navigateByUrl('/card/issuance');
          return;
        }
        if (!this.selectedPlan()) {
          this.selectedPlan.set(plans[0]);
        }
      },
      { allowSignalWrites: true },
    );
  }

  animationCreated(animation: AnimationItem) {
    this.anim = animation;
    this.anim.setSpeed(0.5)
  }
  ngOnInit(): void {
    this.checkPlansExistence();
  }
  checkPlansExistence() {
    if (!this.digiCardIssuanceService.requiredPlans()) {
      this.router.navigateByUrl('card/issuance');
    }
  }

  goBack() {
    this.router.navigate(['/transactions']);
  }

  onNavigate() {
    this.router.navigate(['/subscription/enter'], {
      queryParams: {
        'callback-url': window.location.origin + '/card/issuance/callback/sub',
        'plan-id': this.selectedPlan()!.uuid,
        serviceType: 3,
        referer: 'digicard',
        'is-fast-flow': 1,
      },
    });
  }
  onCancel() {
    this.router.navigate(['/transactions']);
  }

  onSelectingPlan(plan: SubscriptionPlan) {
    this.selectedPlan.set(plan);
  }
  openDetailBottomSheet(plan: SubscriptionPlan) {
    this.bottomSheetService.openBottomSheet(
      SubscriptionServicesBottomSheetComponent,
      {
        plan: plan,
        showSelectButton: false,
      },
      { disableClose: false },
    );
  }
  approveTerms(approve: boolean) {
    this.termsAccepted.set(approve);
  }
}
