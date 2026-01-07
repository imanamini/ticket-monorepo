import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { ConfigResponse } from '../../../data-access/models/credit/activation/config-response.model';
import { CreditRouteStateInterface } from '../../../data-access/services/route-state/credit-route-state.interface';
import { MessageService } from '../../../data-access/services/message.service';
import { STEP_STATUSES } from '../../../data-access/models/credit/activation/step-statuses';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { CreditUserService } from '../../../data-access/services/credit-user.service';
import { CreditWallet } from '../../../data-access/models/credit/wallet/credit-wallet.model';
import { StepFlow } from '../../../data-access/models/credit/activation/get-activation-step-detail.response';
import { LoggedInUser } from '../../../data-access/services/logged-in-user.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditUploadFileListComponent } from '../../../components/credit-upload-file-list/credit-upload-file-list.component';
import { Dir } from '@angular/cdk/bidi';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditNavigationCardV2Component } from '../../../components/credit-navigation-card-v2/credit-navigation-card-v2.component';

@Component({
  selector: 'app-credit-upload-document',
  templateUrl: './credit-upload-document.component.html',
  styleUrls: ['./credit-upload-document.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    Dir,
    CreditUploadFileListComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    PipesModule,
    CreditNavigationCardV2Component,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditUploadDocumentComponent implements OnInit {
  cellNumber = signal('');

  wallet = signal<CreditWallet | null>(null);
  stepIndex!: number;

  config = signal<ConfigResponse | null>(null);

  readyToUpload = signal(false);
  creditId!: string;
  fundProviderCode!: number;
  stepCode!: number;

  btnLoading = signal(false);
  stepFlowsDescription = signal<string | null>(null);
  stepFlows = signal<StepFlow[] | null>(null);
  selectedStepFlow = signal<StepFlow | null>(null);
  isLoading = signal<boolean | null>(null);

  private router = inject(Router);
  private userService = inject(CreditUserService);
  private credit = inject(CreditApiService);
  private cache = inject(CreditCacheService);
  private messageService = inject(MessageService);
  private creditUrlService = inject(CreditUrlService);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {}

  /**
   * Got user data callback. (from API or from memory)
   *
   * @param user
   */
  gotUser(user: LoggedInUser) {
    this.cellNumber.set(user.cellNumber);
  }

  ngOnInit() {
    const state = this.routeStateService.getAll();
    if (!state.step || !state.activationResponse) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }

    this.wallet.set(state.wallet);
    this.fundProviderCode = state.wallet.fundProviderCode;
    this.creditId = state.wallet.creditId;
    this.stepCode = state.step.code;

    // ------------------------------------------
    // Get user data from memory or API
    const user = this.userService.getUserData();
    if (!user) {
      this.userService.getLoggedInUserDataFromApi();
      this.userService.loggedInUser.subscribe((loggedInUser) => {
        if (loggedInUser) {
          this.gotUser(loggedInUser);
        }
      });
    } else {
      this.gotUser(user);
    }

    this.getData();
  }

  /**
   *
   */
  goBack(withCallApi: boolean) {
    if (!withCallApi) {
      this.router.navigateByUrl(
        this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
      );
      return;
    }
    this.btnLoading.set(true);
    this.credit.confirmDocument(this.fundProviderCode, this.creditId, this.selectedStepFlow()?.type!).subscribe({
      next: () => {
        this.btnLoading.set(false);
        this.router.navigateByUrl(
          this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
        );
      },
      error: (e) => {
        this.btnLoading.set(false);
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }

  getData() {
    this.isLoading.set(true);
    Promise.all([this.getConfig(), this.getActivationStepDetail()]).then(() => {
      this.isLoading.set(false);
      this.checkIfAllFilesAreUploaded();
    });
  }

  getConfig(): Promise<void> {
    // Get config once and cache it for later
    return new Promise<void>((resolve) => {
      const ACTIVATION_CONFIG_CACHE = 'CREDIT_ACTIVATION_CONFIG_CACHE';
      if (this.cache.has(ACTIVATION_CONFIG_CACHE)) {
        this.config.set(this.cache.get(ACTIVATION_CONFIG_CACHE));
        resolve();
      } else {
        this.credit.getActivationConfig().subscribe((r) => {
          this.config.set(r);
          resolve();
          this.cache.put(ACTIVATION_CONFIG_CACHE, r);
        });
      }
    });
  }

  getActivationStepDetail(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.credit.getActivationStepDetail(this.fundProviderCode, this.creditId, this.stepCode).subscribe((response) => {
        this.stepFlows.set(response.stepFlow);
        this.stepFlowsDescription.set(response.description);
        if (this.selectedStepFlow()) {
          this.selectStepFlow(this.stepFlows()?.find((item) => item.type === this.selectedStepFlow()?.type)!);
        }
        if (!this.selectedStepFlow() && this.stepFlows() && this.stepFlows()?.length === 1) {
          this.selectStepFlow(this.stepFlows()![0]);
        }
        resolve();
      });
    });
  }

  selectStepFlow(data: StepFlow): void {
    this.selectedStepFlow.set(data);
    this.checkIfAllFilesAreUploaded();
  }

  /**
   * Check if all the necessary (required) files are uploaded
   * to enable button
   */
  private checkIfAllFilesAreUploaded() {
    let valid = true;
    this.selectedStepFlow()?.step?.child.forEach((step) => {
      if (step.primary && !step.stepResult) {
        valid = false;
      }
      if (STEP_STATUSES[step.status] === 'OPERATIONAL_REJECTION') {
        valid = false;
      }
    });
    this.readyToUpload.set(valid);
  }
}
