import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { MaxCreditAmountStepComponent, StepsBaseComponent } from '../components';
import { IcsStepComponent } from '../components';
import {
  IdentityEvaluationStepComponent
} from '../components';
import {
  FundProviderActivationStepComponent
} from '../components';

import { ComponentType } from '@angular/cdk/overlay';
import { StepUID } from '../../../api/clients/registration-v3/basic-models/registration-v3-step.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {
  private eventData = new Subject<any>();
  eventData$ = this.eventData.asObservable();

  static componentRef: ComponentRef<StepsBaseComponent>;
  dictionary: Record<StepUID, ComponentType<StepsBaseComponent>> = {
    [StepUID.SAMAN_CREDIT_REVISE_STEP]: MaxCreditAmountStepComponent,
    [StepUID.SAMAN_ICS_STEP]: IcsStepComponent,
    [StepUID.SAMAN_IDENTITY_EVALUATION_STEP]: IdentityEvaluationStepComponent,
    [StepUID.SAMAN_FUND_PROVIDER_EVALUATION_STEP]: FundProviderActivationStepComponent,
  };

  public createComponent(page: StepUID, container: ViewContainerRef, steps: any, details: any, creditId: string, type: number): void {
    const component: ComponentType<StepsBaseComponent> = this.dictionary[page];
    this.updatePage(component, container, steps, details, creditId, type);
  }

  private updatePage(component: ComponentType<StepsBaseComponent>, container: ViewContainerRef, steps: any, details: any, creditId: string, type: number): void {
    if (FactoryService.componentRef) {
      FactoryService.componentRef.destroy();
    }
    FactoryService.componentRef = container.createComponent(component);
    FactoryService.componentRef.setInput('steps', steps);
    FactoryService.componentRef.setInput('details', details);
    FactoryService.componentRef.setInput('creditId', creditId);
    FactoryService.componentRef.setInput('type', type);
    FactoryService.componentRef?.instance?.reloadDataEvent?.subscribe((val: any) => {
        this.eventData.next(val);
      }
    );
  }

}
