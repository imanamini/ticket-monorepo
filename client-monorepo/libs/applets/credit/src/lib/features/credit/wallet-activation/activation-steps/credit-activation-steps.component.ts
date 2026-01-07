import { ChangeDetectionStrategy, Component, inject, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { ActivationResponse } from '../../data-access/models/credit/activation/activation-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { Step } from '../../data-access/models/credit/activation/step.model';
import { MessageService } from '../../data-access/services/message.service';
import { WalletCardService } from '../../data-access/services/wallet-card.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CreditRouteStateInterface } from '../../data-access/services/route-state/credit-route-state.interface';
import { CreditPageDialogComponent } from '../../components/credit-page-dialog/credit-page-dialog.component';
import { CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { ACTIVATION_STATUS } from '../../data-access/models/credit/activation/activation-status';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';
import { SignalClient } from '@digipay/ng-payment';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { CreditInfoCardComponent } from '../../components/credit-info-card/credit-info-card.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditStepComponent } from '../../components/credit-step/credit-step.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditAccountSuspendComponent } from '../credit-account-suspend/credit-account-suspend.component';
import { CancelActivationService } from '../cancel-activation-bottom-sheet/cancel-activation.service';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxDpPullToRefreshDirective } from '@digipay/ngx-dp-pull-to-refresh';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';

@Component({
  selector: 'app-credit-activation-steps',
  templateUrl: './credit-activation-steps.component.html',
  styleUrls: ['./credit-activation-steps.component.scss'],
  standalone: true,
  imports: [
    CreditAccountSuspendComponent,
    CreditAppBarComponent,
    NgxTrackableIdDirective,
    CreditScrollableViewComponent,
    CreditStepComponent,
    NgxButtonComponent,
    CreditInfoCardComponent,
    NgxIcon,
    CreditPageLoadingComponent,
    PipesModule,
    NgxCheckboxComponent,
    NgxDpPullToRefreshDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditActivationStepsComponent implements OnInit, OnDestroy {
  activation = signal<ActivationResponse | null>(null);

  isSuspended = signal<boolean | null>(null);

  wallet = signal<CreditWallet | null>(null);

  gettingData = signal<boolean>(true);

  activationStep = signal<Step | null>(null);

  activatingWallet = signal<boolean>(false);

  serviceTypeName = signal('');

  fundProviderCode!: number;

  creditId!: string;

  getWalletSubscription!: Subscription;

  private destroy$ = new Subject<void>();

  checkCloseButton = signal<boolean | null>(null);

  backButtonLink = signal<string | null>(null);
  acceptedStepRequirements = signal<{ [key: number]: boolean }>({});
  acceptedAllRequirements = signal<boolean | null>(null);
  isReadyToArchive = signal<boolean>(false);
  isExpired = signal<boolean | null>(null);
  revertingCancel = signal<boolean | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);
  creditService = inject(CreditApiService);
  walletCardService = inject(WalletCardService);
  router = inject(Router);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  creditUrlService = inject(CreditUrlService);
  creditServiceTypeService = inject(CreditServiceTypeService);
  cancelActivationService = inject(CancelActivationService);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {
    this.backButtonLink.set(
      this.creditServiceTypeService.giveResultByType<string>(
        this.creditUrlService.getInnerServicePath('/overview'),
        this.creditUrlService.getHomeAppPath(),
      ),
    );

    if (
      this.backButtonLink() === '/home' &&
      this.creditServiceTypeService.isBnpl() &&
      this.creditServiceTypeService.creditEnv === 'mini-app'
    ) {
      this.checkCloseButton.set(true);
    }

    this.cancelActivationService.onRefreshRequested$
      .pipe(takeUntil(this.destroy$)) // Add this.destroy$ = new Subject<void>(); to your component
      .subscribe(() => {
        this.getActivationStepsData();
      });
  }

  ngOnInit(): void {
    this.setTitle();
    // Redirect when a client comes from home app
    if (typeof this.route.snapshot.params['fundProviderCode'] === 'undefined') {
      const routeState = this.routeStateService.getAll();
      if (
        routeState &&
        routeState.homeAction &&
        routeState.homeAction.payload &&
        typeof routeState.homeAction.payload.fundProviderCode !== 'undefined' &&
        typeof routeState.homeAction.payload.creditId !== 'undefined'
      ) {
        const fpCode = routeState.homeAction.payload.fundProviderCode;
        const creditId = routeState.homeAction.payload.creditId;
        const destinationUrl = this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${fpCode}/${creditId}`);
        if (routeState.homeAction.payload.shouldAcceptTac) {
          this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/wallet/tac'), {
            state: {
              destination: destinationUrl,
            },
          });
          return;
        }
        this.router.navigateByUrl(destinationUrl);
        return;
      }
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }
    this.fundProviderCode = +this.route.snapshot.params['fundProviderCode'];
    this.creditId = this.route.snapshot.params['creditId'];
    this.handleSuspendState();
    this.getActivationStepsData();
  }

  setTitle(): void {
    this.serviceTypeName.set(this.creditServiceTypeService.isBnpl() ? 'اعتبار' : 'وام');
  }

  openFirstInCompleteStep() {
    if (this.isExpired()) {
      return;
    }
    let found = false;
    this.activation()?.steps.forEach((step, i) => {
      if ((step.state === 'ACTIVE' || step.state === 'WARNING') && step.primary && !found) {
        found = true;
        this.activation()!.steps[i].open = true;
        this.scrollOnActiveStep(i);
      }
    });
  }

  handleTapAndGo(): void {
    if (this.isExpired()) {
      return;
    }
    this.gettingData.set(true);
    if (this.route.snapshot.params['action'] === 'next') {
      this.activation()?.steps.forEach((step, i) => {
        if (
          step.kind !== 'WALLET_ACTIVATION' &&
          step.actionText &&
          (step.state === 'ACTIVE' || step.state === 'WARNING') &&
          step.statusText !== 'COMPLETED' &&
          this.acceptedAllRequirements() &&
          step.primary
        ) {
          this.stepActionClicked(this.activation()?.steps[i]!, i);
        }
      });
    }
    if (this.activation()?.hasOfferedPlans) {
      this.goToOffersPlanPage();
    }
  }

  goToOffersPlanPage() {
    const scoringStepIndex = this.activation()?.steps.findIndex((step) => step.kind === 'BANK_SCORE_WITHOUT_PAY');
    this.stepActionClicked(this.activation()?.steps[scoringStepIndex!]!, scoringStepIndex!, true);
  }

  handleSuspendState() {
    if (this.route.snapshot.params['action'] === 'suspend') {
      this.isSuspended.set(true);
      this.gettingData.set(false);
      return;
    }
  }

  stepHeaderClick(index: number) {
    const clickedStep = this.activation()?.steps[index];
    if (['COMPLETED', 'FAILED'].indexOf(clickedStep?.statusText!) >= 0 || !clickedStep?.active) {
      // should not open when a step is COMPLETED or FAILED
      return;
    }

    this.activation()?.steps.forEach((step, i) => {
      if (i === index) {
        // toggle the body of clicked step
        this.activation()!.steps[i].open = !this.activation()?.steps[i].open;
        if (this.activation()?.steps[i].open) {
          this.scrollOnActiveStep(i);
        }
      } else {
        // close all other steps
        this.activation()!.steps[i].open = false;
      }
    });
  }

  scrollOnActiveStep(stepIndex: number) {
    requestAnimationFrame(() => {
      const targetElement = document.getElementById('step' + stepIndex);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    });
  }

  /**
   * When a user clicks on the button of the step
   *
   */
  stepActionClicked(step: Step, stepIndex: number, showOffersPlan = false) {
    if (
      !(this.isExpired() || this.isReadyToArchive()) &&
      ((step.actionText && step.statusText !== 'COMPLETED' && step.active) || showOffersPlan)
    ) {
      const state = {
        step,
        activationResponse: this.activation(),
        wallet: this.wallet(),
        stepIndex,
      };

      const routeMap: { [key: string]: string } = {
        BANK_SCORE: `/score/v2/${this.fundProviderCode}/${this.creditId}`,
        BANK_SCORE_WITHOUT_PAY: `/score/v2/${this.fundProviderCode}/${this.creditId + (showOffersPlan ? '?offeredPlans=true' : '')}`,
        UPLOAD: '/wallet/activation/upload',
        PROFILE: `/wallet/activation/profile/${this.fundProviderCode}/${this.creditId}`,
        CHEQUE: `/wallet/activation/cheque/${this.fundProviderCode}/${this.creditId}`,
        INSTALLMENT_SELLS: `/wallet/activation/cheque/installment-sells/${this.fundProviderCode}/${this.creditId}`,
        FILING_PAYMENT: `/wallet/activation/payment/${this.fundProviderCode}/${this.creditId}`,
        ALLOCATION_PREPAYMENT: `/wallet/activation/pre-payment/${this.fundProviderCode}/${this.creditId}`,
        BANK_ACCOUNT_VERIFICATION: `/wallet/activation/bank-account-verification/${this.fundProviderCode}/${this.creditId}`,
        DIGITAL_SIGNATURE_AND_ONLINE_CONTRACT: `/wallet/activation/digital-sign-contract/${this.fundProviderCode}/${this.creditId}`,
        GENERATE_DIGITAL_SIGNATURE: `/wallet/activation/generate-digital-sign-contract/v2/${this.fundProviderCode}/${this.creditId}`,
        SIGNING_DOCUMENT: `/wallet/activation/signing-documents/${this.fundProviderCode}/${this.creditId}`,
        ENOTE: `/wallet/activation/enote/resolve/${this.fundProviderCode}/${this.creditId}`,
        ACCOUNT_BLOCK: `/wallet/activation/account-block/${this.fundProviderCode}/${this.creditId}`,
        CHECK_CREDIT_FILE: `/wallet/activation/check-credit-file/${this.fundProviderCode}/${this.creditId}`,
        DIGIPAY_SUBSCRIPTION: `/wallet/activation/subscription/${this.fundProviderCode}/${this.creditId}`,
        SMC_SCORE: `/smc-score/${this.fundProviderCode}/${this.creditId}`,
      };
      const route = routeMap[step.kind];

      sessionStorage.setItem('state', JSON.stringify(state));

      if (route) {
        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(route), { state });
      }
    }
  }

  /**
   * Activate wallet
   * Call API and go to final page
   */
  activateWalletButtonClick() {
    this.activatingWallet.set(true);
    this.creditService.activateWallet(this.fundProviderCode, this.creditId).subscribe({
      next: () => {
        this.activatingWallet.set(false);
        // Get updated wallet
        this.goToCreditWallet();
      },
      error: (e) => {
        this.activatingWallet.set(false);
        if (e?.result?.message) {
          this.messageService.showErrorOfErrorResponse(e);
        } else {
          this.messageService.showErrorMessage('بروز خطا! لطفا مجددا تلاش کنید');
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getWalletSubscription) {
      this.getWalletSubscription.unsubscribe();
    }

    this.destroy$.next();
    this.destroy$.complete();
    this.cancelActivationService.destroy();
  }

  onCancelActivationClick() {
    if (this.isReadyToArchive()) {
      return;
    }
    this.cancelActivationService.getData(this.creditId);
  }

  openRequirementDialog($event: MouseEvent, url: string, title: string): void {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this.bottomSheetService.openBottomSheet(CreditPageDialogComponent, {
      title,
      relativeUrl: url,
    });
  }

  changeStepRequirementsAcceptance(requirementIndex: number, $event: any): void {
    this.acceptedStepRequirements()[requirementIndex] = $event.checked;
    this.updateAcceptedAllRequirements();
  }

  updateAcceptedAllRequirements(): void {
    this.acceptedAllRequirements.set(true);
    if (this.activation()?.stepRequirements) {
      this.activation()?.stepRequirements.map((item, index) => {
        if (!this.acceptedStepRequirements()[index]) {
          this.acceptedAllRequirements.set(false);
          return;
        }
      });
    }
  }

  revertCancelRequest() {
    this.revertingCancel.set(true);
    this.creditService.revertCancelRequest(this.creditId).subscribe({
      next: () => {
        this.getActivationStepsData();
        this.revertingCancel.set(false);
      },
      error: (error) => {
        this.revertingCancel.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  closeService() {
    SignalClient.close('credit');
  }

  getActivationStepsData(loading = true) {
    if (loading) {
      this.gettingData.set(true);
    }
    this.getWalletSubscription = this.walletCardService.getWallet(this.fundProviderCode, this.creditId).subscribe({
      next: (wallet) => {
        if (wallet) {
          this.wallet.set(wallet);
          this.getActivationSteps(this.fundProviderCode, this.creditId);
        } else {
          this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve'));
        }
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve'));
      },
    });
  }

  private getActivationSteps(fundProviderCode: string | number, creditId: string) {
    this.creditService.getActivation(fundProviderCode, creditId).subscribe({
      next: (response) => {
        if (this.creditServiceTypeService.isBnpl() && response?.status === ACTIVATION_STATUS.COMPLETED) {
          this.goToBnplWallet();
          return;
        }
        this.isSuspended.set(response.isSuspended);
        this.activation.set(response);
        this.isReadyToArchive.set(Boolean(response?.status === ACTIVATION_STATUS.READY_TO_ARCHIVE));
        this.isExpired.set(response.isExpired);
        // check wallet is activated
        const activationSteps = response.steps.filter((s) => s.kind === 'WALLET_ACTIVATION' && s.active);
        this.activationStep.set(activationSteps.length > 0 ? activationSteps[0] : null);
        if (this.activationStep()) {
          this.goToWallet();
          return;
        }
        this.openFirstInCompleteStep();
        this.acceptedStepRequirements.set({});
        this.updateAcceptedAllRequirements();
        this.handleTapAndGo();
        this.gettingData.set(false);
      },
      error: (e) => {
        this.messageService.showErrorOfErrorResponse(e);
        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      },
    });
  }

  private goToWallet() {
    if (this.creditServiceTypeService.isCredit()) {
      this.goToCreditWallet();
      return;
    }
    if (this.creditServiceTypeService.isBnpl()) {
      this.goToBnplWallet();
      return;
    }
  }

  private goToBnplWallet() {
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/detail/${this.creditId}`), {
        state: {
          customLinkForBack: '/',
        },
      })
      .then();
  }

  private goToCreditWallet() {
    this.getUpdatedWallet().then(() => {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/detail/${this.creditId}`), {
        state: {
          customLinkForBack: '/',
        },
      });
    });
  }

  /**
   * After activating the wallet, we need to find
   */
  private getUpdatedWallet(): Promise<CreditWallet> {
    return new Promise((resolve) => {
      try {
        this.getWalletSubscription.unsubscribe();
        this.getWalletSubscription = this.walletCardService.getWallet(this.fundProviderCode, this.creditId, true).subscribe((wallet) => {
          resolve(wallet);
        });
      } catch (e) {
        resolve(this.wallet()!);
      }
    });
  }
}
