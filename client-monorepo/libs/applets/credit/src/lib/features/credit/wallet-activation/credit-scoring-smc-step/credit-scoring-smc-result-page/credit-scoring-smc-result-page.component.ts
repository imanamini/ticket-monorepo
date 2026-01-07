import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import {
  CreditScoringSmcStepResultData,
  CreditScoringStepResultDataInterface,
  ScoringStatusType,
} from './credit-scoring-smc-step-result-data';
import { CreditUrlService } from '../../../data-access/utils/url';
import { Router } from '@angular/router';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditScoringSmcWithoutPayService } from '../services/credit-scoring-smc-without-pay.service';
import { CancelActivationBottomSheetComponent } from '../../cancel-activation-bottom-sheet/cancel-activation-bottom-sheet.component';
import { CreditScoringSmcStepResultStatusComponent } from '../credit-scoring-smc-step-result-status/credit-scoring-smc-step-result-status.component';
import { CancelActivationBottomSheetResult } from '../../../data-access/models/credit/activation/cancel-activation/cancel-activation-reasons.response';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-scoring-smc-result-page',
  templateUrl: './credit-scoring-smc-result-page.component.html',
  standalone: true,
  imports: [CreditScoringSmcStepResultStatusComponent, CreditPageLoadingComponent, CreditAppBarComponent],
  styleUrls: ['./credit-scoring-smc-result-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringSmcResultPageComponent {
  fundProviderCode = input<number>();
  creditId = input.required<string>();
  status = input<ScoringStatusType>();
  gettingData = input<boolean>();
  trackingCode = input<string>();
  suggestedPlans = input<PlanGroup[]>([]);
  loading = signal<boolean>(false);
  report = output<void>();
  finalStatus = computed(() => this.status());
  data = computed<CreditScoringStepResultDataInterface>(() => CreditScoringSmcStepResultData[this.finalStatus()!]);
  actionImage = computed(() => (!this.trackingCode() ? undefined : this.data() && this.data().actionIcon));
  actionText = computed(() => (!this.trackingCode() ? 'لغو فرایند' : this.data() && this.data().actionText));
  back = output<void>();

  creditUrlService = inject(CreditUrlService);
  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);
  router = inject(Router);
  creditScoringService = inject(CreditScoringSmcWithoutPayService);
  bottomSheetService = inject(NgxBottomSheetService);

  exit(): void {
    this.goToSteps();
  }

  goToResolve() {
    this.creditScoringService.clearTrackingCode();
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/resolve`));
  }

  goToSteps() {
    this.back.emit();
  }

  onActionClick(): void {
    if (!this.trackingCode()) {
      this.showCancelActivationBottomSheet();
      return;
    }
    if (this.status() === 'FAILED') {
      window.location.replace('tel:+982153924000');
    }
  }

  showCancelActivationBottomSheet() {
    this.loading.set(true);
    this.bottomSheetService.openBottomSheet(
      CancelActivationBottomSheetComponent,
      {
        data: {
          creditId: this.creditId(),
          fundProviderCode: this.fundProviderCode(),
        },
      },
      {
        noPadding: true,
      },
    );

    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      const result: CancelActivationBottomSheetResult = this.bottomSheetService.outputData();
      if (result && result.done) {
        this.goToResolve();
      } else {
        this.loading.set(false);
      }
    });
  }

  confirmPlan(selectedPlan: PlanGroup) {
    this.cancelActivation(selectedPlan);
  }

  cancelActivation(selectedPlan?: PlanGroup) {
    this.loading.set(true);
    const cancelReasonType = '1';
    const cancelReason = '';
    this.creditApiService
      .cancelCreditActivation(this.fundProviderCode() as number, this.creditId(), cancelReasonType, cancelReason)
      .subscribe({
        next: () => {
          if (selectedPlan) {
            this.goToRegisterForm(selectedPlan.planId, selectedPlan.groupId);
          } else {
            this.goToResolve();
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  goToRegisterForm(planId: string, groupId: string): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/pre-register/submit/${planId}/${groupId}`)).then();
  }
}
