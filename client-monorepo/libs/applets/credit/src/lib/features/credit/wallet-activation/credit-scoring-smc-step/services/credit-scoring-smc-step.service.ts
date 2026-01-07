import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreditScoringSmcFlowStep } from './credit-scoring-smc-flow-step';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { Router } from '@angular/router';
import { MessageService } from '../../../data-access/services/message.service';

export type errorType = 'SHAHKAR_FAILED' | null;

@Injectable({
  providedIn: 'root',
})
export class CreditScoringSmcStepService {
  openDialogErrorStatus = 160627;
  trackingCode!: string | null;
  nationalCode!: string;
  fundProviderCode!: string;
  creditId!: string;
  steps: CreditScoringSmcFlowStep[] = [];
  activeStepIndex = new BehaviorSubject(0);
  errorType = new BehaviorSubject<errorType>(null);

  constructor(
    protected creditApiService: CreditApiService,
    protected creditUrlService: CreditUrlService,
    protected messageService: MessageService,
    protected router: Router,
  ) {}

  getActiveStep(): CreditScoringSmcFlowStep {
    return this.steps[this.activeStepIndex.getValue()];
  }

  closeFlow(): void {
    if (this.fundProviderCode && this.creditId) {
      this.router.navigateByUrl(
        this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
      );
    } else {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
    }
  }

  prevStep(): void {
    const activeStep = this.getActiveStep();
    if (!activeStep.canBack) {
      return;
    }
    const activeIndex = this.activeStepIndex.getValue();
    let newStep = activeIndex - 1;
    while (newStep >= 0 && this.steps[newStep].skipInPrev) {
      newStep--;
    }
    if (newStep < 0) {
      this.closeFlow();
      return;
    }
    this.activeStepIndex.next(newStep);
  }

  nextStep(): void {
    const activeStepIndex = this.activeStepIndex.getValue();
    if (activeStepIndex + 1 <= this.steps.length - 1) {
      this.activeStepIndex.next(activeStepIndex + 1);
    } else {
      this.finishFlow();
    }
  }

  handleError(errorType: errorType) {
    this.errorType.next(errorType);
  }

  protected getPath(relativeUrl: string): string {
    return this.creditUrlService.getInnerServicePath('/score/' + relativeUrl);
  }

  protected finishFlow(): void {
    this.router.navigateByUrl(this.getPath(`result/${this.fundProviderCode}/${this.creditId}`));
  }
}
