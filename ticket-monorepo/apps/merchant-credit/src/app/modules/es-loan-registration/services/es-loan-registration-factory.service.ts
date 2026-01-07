import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

import { EsLoanStepUID } from '../../../api/clients/es-loan-registration/models/es-loan-registration-model';
import {
  EsLoanRegistrationBaseStepComponent,
  EsLoanRegisterationGetCreditAmountStepComponent,
  EsLoanSettlementSelectLoanAmountStepComponent,
  EsLoanSettlementPaymentStepComponent, EsLoanSendCheckStepComponent, EsLoanRegisterationIcsReportingStepComponent
} from '../pages/es-loan-registration-steps';
import { EsLoanStep } from '../../../api/clients/es-loan-registration/models/es-loan-step';
import { EsLoanStateModel } from '../../../api/clients/es-loan-registration/models/es-loan-get-steps.response';

@Injectable({
  providedIn: 'root'
})
export class EsLoanRegistrationFactoryService {

  private eventData = new Subject<any>();
  eventData$ = this.eventData.asObservable();

  static componentRef: ComponentRef<EsLoanRegistrationBaseStepComponent>;
  dictionary: Record<EsLoanStepUID, ComponentType<EsLoanRegistrationBaseStepComponent>> = {
    [EsLoanStepUID.ES_LOAN_REGISTRATION_ICS_REPORTING_STEP]: EsLoanRegisterationIcsReportingStepComponent,
    [EsLoanStepUID.ES_LOAN_REGISTRATION_GET_CREDIT_AMOUNT_STEP]: EsLoanRegisterationGetCreditAmountStepComponent,
    [EsLoanStepUID.ES_LOAN_SETTLEMENT_SELECT_LOAN_AMOUNT_STEP]: EsLoanSettlementSelectLoanAmountStepComponent,
    [EsLoanStepUID.ES_LOAN_SETTLEMENT_SEND_CHECK_STEP]: EsLoanSendCheckStepComponent,
    [EsLoanStepUID.ES_LOAN_SETTLEMENT_PAY_FEE_STEP]: EsLoanSettlementPaymentStepComponent,
  };

  public createComponent(page: EsLoanStepUID, container: ViewContainerRef, steps: EsLoanStep[], esLoanStateModel: EsLoanStateModel, requestAmount: number): void {
    const component: ComponentType<EsLoanRegistrationBaseStepComponent> = this.dictionary[page];
    this.updatePage(component, container, steps, esLoanStateModel, requestAmount);
  }

  private updatePage(component: ComponentType<EsLoanRegistrationBaseStepComponent>, container: ViewContainerRef, steps: EsLoanStep[], esLoanStateModel: EsLoanStateModel, requestAmount: number): void {
    if (EsLoanRegistrationFactoryService.componentRef) {
      EsLoanRegistrationFactoryService.componentRef.destroy();
    }
    EsLoanRegistrationFactoryService.componentRef = container.createComponent(component);
    EsLoanRegistrationFactoryService.componentRef.setInput('steps', steps);
    EsLoanRegistrationFactoryService.componentRef.setInput('esLoanStateModel', esLoanStateModel);
    EsLoanRegistrationFactoryService.componentRef.setInput('requestAmount', requestAmount);
    EsLoanRegistrationFactoryService.componentRef?.instance?.reloadDataEvent?.subscribe((val: any) => {
        this.eventData.next(val);
      }
    );
  }

}
