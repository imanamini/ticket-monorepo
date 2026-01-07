import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponentType } from '@angular/cdk/overlay';
import {
  EsLoanSamanBaseStepComponent, EsLoanSamanFundProviderActivationStepComponent,
  EsLoanSamanIcsStepComponent, EsLoanSamanIdentityEvaluationStepComponent,
  EsLoanSamanMaxCreditAmountStepComponent
} from '../components';
import { StepUID } from '../../../../../../../api/clients/es-loan-registration/models/es-loan-saman.model';
import {
  RegistrationStep
} from '../../../../../../../api/clients/registration-v3/basic-models/registration-v3-step.model';
import { EsLoanStep } from '../../../../../../../api/clients/es-loan-registration/models/es-loan-step';

@Injectable({
  providedIn: 'root'
})
export class EsLoanSamanFactoryService {

  private eventData = new Subject<any>();
  eventData$ = this.eventData.asObservable();

  private closeEvent = new Subject<any>();
  closeEvent$ = this.closeEvent.asObservable();

  static componentRef: ComponentRef<EsLoanSamanBaseStepComponent>;
  dictionary: Record<StepUID, ComponentType<EsLoanSamanBaseStepComponent>> = {
    [StepUID.SAMAN_CREDIT_REVISE_STEP]: EsLoanSamanMaxCreditAmountStepComponent,
    [StepUID.SAMAN_ICS_STEP]: EsLoanSamanIcsStepComponent,
    [StepUID.SAMAN_IDENTITY_EVALUATION_STEP]: EsLoanSamanIdentityEvaluationStepComponent,
    [StepUID.SAMAN_FUND_PROVIDER_EVALUATION_STEP]: EsLoanSamanFundProviderActivationStepComponent,
  };

  public createComponent(container: ViewContainerRef, page: StepUID, steps: EsLoanStep[], registrationStep: RegistrationStep[], details: any, creditId: string, type: number): void {
    const component: ComponentType<EsLoanSamanBaseStepComponent> = this.dictionary[page];
    this.updatePage(component, container, registrationStep, details, creditId, type);
  }

  private updatePage(component: ComponentType<EsLoanSamanBaseStepComponent>, container: ViewContainerRef, registrationStep: RegistrationStep[], details: any, creditId: string, type: number): void {
    if (EsLoanSamanFactoryService.componentRef) {
      EsLoanSamanFactoryService.componentRef.destroy();
    }
    EsLoanSamanFactoryService.componentRef = container.createComponent(component);
    EsLoanSamanFactoryService.componentRef.setInput('steps', registrationStep);
    EsLoanSamanFactoryService.componentRef.setInput('details', details);
    EsLoanSamanFactoryService.componentRef.setInput('creditId', creditId);
    EsLoanSamanFactoryService.componentRef.setInput('type', type);
    EsLoanSamanFactoryService.componentRef?.instance?.reloadDataEvent?.subscribe((val: any) => {
        this.eventData.next(val);
      }
    );
    EsLoanSamanFactoryService.componentRef?.instance?.reloadCloseEvent?.subscribe((val: any) => {
        this.closeEvent.next(val);
      }
    );
  }
}
