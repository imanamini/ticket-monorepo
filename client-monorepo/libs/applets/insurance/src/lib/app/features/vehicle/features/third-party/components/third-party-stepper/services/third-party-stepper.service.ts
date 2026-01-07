import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ThirdPartyStepperConfigModel } from '../models/third-party-stepper-config.model';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyStepperService {

  private config: BehaviorSubject<ThirdPartyStepperConfigModel> = new BehaviorSubject<ThirdPartyStepperConfigModel>({
    disabled: true,
    title: '',
    stepName: '',
    currentStep: 0,
    totalSteps: 0
  });

  constructor() {
  }

  setConfig(config: ThirdPartyStepperConfigModel): void {
    this.config.next(config);
  }

  getConfig(): Observable<ThirdPartyStepperConfigModel> {
    return this.config.asObservable();
  }
}
