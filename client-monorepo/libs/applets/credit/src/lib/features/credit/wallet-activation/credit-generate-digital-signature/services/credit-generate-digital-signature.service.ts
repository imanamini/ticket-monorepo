import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from '../../../data-access/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { GeneralDigitalSignatureSteps } from '../credit-generate-digital-signature-step/general-digital-signature-steps.model';

export type GenerateDigitalSignatureErrorTypes = 'NO_SERVICE' | 'FAILED_GENERATION';

@Injectable({
  providedIn: 'root',
})
export class CreditGenerateDigitalSignatureService {
  errorType = new BehaviorSubject<GenerateDigitalSignatureErrorTypes | null>(null);
  fundProviderCode!: number;
  creditId!: string;
  errorTypeMap: { [key: number]: GenerateDigitalSignatureErrorTypes } = {
    1118: 'NO_SERVICE',
    5320: 'FAILED_GENERATION',
  };
  public digitalSignatureAutoNavigation = signal(true);
  public currentStep = signal(1);
  public totalSteps = GeneralDigitalSignatureSteps.length;

  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.initializeRouteParams();
  }

  private initializeRouteParams(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
  }

  setDigitalSignatureAutoNavigation(state: boolean) {
    this.digitalSignatureAutoNavigation.set(state);
  }

  handleError(error: any): void {
    if (!error?.result) {
      this.messageService.showErrorMessage('متاسفانه مشکلی پیش آمده لطفا با پشتیبانی تماس بگیرید.');
      return;
    }
    if (this.errorTypeMap[error.result.status]) {
      this.errorType.next(this.errorTypeMap[error.result.status]);
      return;
    }
    this.messageService.showErrorOfErrorResponse(error);
  }

  getNextStepURL(currentStep: string) {
    const currentStepIndex = GeneralDigitalSignatureSteps.findIndex((step) => step.url === currentStep);
    if (currentStepIndex < GeneralDigitalSignatureSteps.length) {
      return GeneralDigitalSignatureSteps[currentStepIndex + 1].url;
    }
    return null;
  }

  setCurrentStep(currentStep: string) {
    const currentStepIndex = GeneralDigitalSignatureSteps.findIndex((step) => step.url === currentStep);
    this.currentStep.set(currentStepIndex + 1);
  }
}
