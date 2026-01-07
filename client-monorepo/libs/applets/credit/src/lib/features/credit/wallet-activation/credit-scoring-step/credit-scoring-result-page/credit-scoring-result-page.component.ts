import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CreditScoringStepResultData, CreditScoringStepResultDataInterface, ScoringStatusType } from './credit-scoring-step-result-data';
import { CreditUrlService } from '../../../data-access/utils/url';
import { Router } from '@angular/router';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { CancelActivationBottomSheetComponent } from '../../cancel-activation-bottom-sheet/cancel-activation-bottom-sheet.component';
import { CreditScoringStepResultSuggestedPlansComponent } from '../credit-scoring-step-result-suggested-plans/credit-scoring-step-result-suggested-plans.component';
import { CreditScoringStepResultStatusComponent } from '../credit-scoring-step-result-status/credit-scoring-step-result-status.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditScoringStepService } from '../services/credit-scoring-step.service';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CancelActivationMessageAction } from '../../cancel-activation-bottom-sheet/cancel-activation-bottom-sheet.model';
import { NgxStateService } from '@digipay/ngx-status-result';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-credit-scoring-result-page',
  templateUrl: './credit-scoring-result-page.component.html',
  styleUrls: ['./credit-scoring-result-page.component.scss'],
  standalone: true,
  imports: [
    CreditScoringStepResultSuggestedPlansComponent,
    CreditScoringStepResultStatusComponent,
    CreditAppBarComponent,
    NgxSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringResultPageComponent {
  fundProviderCode = input.required<number>();
  creditId = input.required<string>();
  status = input<ScoringStatusType>();
  gettingData = input<boolean>();
  trackingCode = input<string>();
  suggestedPlans = input<PlanGroup[]>([]);
  showSuggestedPlans = signal(false);
  loading = signal<boolean>(false);
  report = output<void>();
  finalStatus = computed(() => (this.suggestedPlans().length ? 'OFFERS' : this.status()));
  data = computed<CreditScoringStepResultDataInterface>(() => CreditScoringStepResultData[this.finalStatus()!]);
  actionImage = computed(() => (!this.trackingCode() ? undefined : !this.showSuggestedPlans() && this.data() && this.data().actionIcon));
  actionText = computed(() => (!this.trackingCode() ? 'لغو فرایند' : !this.showSuggestedPlans() && this.data() && this.data().actionText));
  actionTextMode = computed(() => (this.trackingCode() ? 'info' : 'error'));

  creditUrlService = inject(CreditUrlService);
  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);
  router = inject(Router);
  creditScoringService = inject(CreditScoringStepService);
  bottomSheetService = inject(NgxBottomSheetService);
  stateService = inject(NgxStateService);

  goToActivation(): void {
    this.creditScoringService.goToNextCreditStep();
  }

  exit(): void {
    if (this.suggestedPlans().length) {
      this.goToResolve();
      return;
    }
    this.goToSteps();
  }

  goToResolve() {
    this.creditScoringService.clearTrackingCode();
    this.creditScoringService.goToCreditHome('resolve');
  }

  goToSteps() {
    this.creditScoringService.closeFlow();
  }

  onActionClick(): void {
    if (!this.trackingCode()) {
      this.onCancelActivationClick();
      return;
    }
    if (this.status() === 'SUCCESS') {
      this.report.emit();
    }
    if (this.status() === 'FAILED') {
      window.location.replace('tel:+982153924000');
    }
  }

  onCancelActivationClick(): void {
    this.stateService.openBottomSheet({
      type: 'Confirmation',
      icon: 'question',
      title: 'لغو فرایند دریافت اعتبار',
      description:
        'در صورت لغو فرایند و اقدام به دریافت اعتبار جدید، تمامی مراحل ثبت‌نام شما از ابتدا صورت خواهد گرفت.آیا از لغو فرایند اطمینان دارید؟',
      buttons: [
        {
          label: 'بستن',
          id: CancelActivationMessageAction.CLOSE,
          style: 'tinted-on-elevated',
          mode: 'form',
          fullWidth: true,
        },
        {
          label: 'اطمینان دارم',
          id: CancelActivationMessageAction.CONFIRM,
          style: 'fill',
          mode: 'form',
          fullWidth: true,
        },
      ],
    });

    const onClose = this.stateService.onClose().subscribe({
      next: () => {
        onClose.unsubscribe();
        const result = this.stateService.outputData();
        if (result?.clicked === 'CONFIRM') {
          this.showCancelActivationBottomSheet();
        }
      },
      error: (error) => {
        console.error('[CreditScoringResultPage] Error in stateService.onClose:', error);
        onClose.unsubscribe();
      },
    });
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
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onCloseBottomSheet.unsubscribe();
        const result = this.bottomSheetService.outputData();
        if (result && result.done) {
          this.goToResolve();
        } else {
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.error('[CreditScoringResultPage] Error in bottomSheet.onClose:', error);
        onCloseBottomSheet.unsubscribe();
        this.loading.set(false);
      },
    });
  }

  confirmPlan(selectedPlan: PlanGroup) {
    this.cancelActivation(selectedPlan);
  }

  cancelActivation(selectedPlan?: PlanGroup) {
    this.loading.set(true);
    const cancelReasonType = '1';
    const cancelReason = '';
    this.creditApiService.cancelCreditActivation(this.fundProviderCode(), this.creditId(), cancelReasonType, cancelReason).subscribe({
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
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/pre-register/submit/${planId}/${groupId}`))
      .then(() => {
        // Navigation successful
      })
      .catch((error) => {
        console.error('[CreditScoringResultPage] Error navigating to register form:', error);
      });
  }
}
