import { inject, Injectable } from '@angular/core';
import {
  EsLoanRegistrationApiService
} from '../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import { BehaviorSubject } from 'rxjs';
import { EsLoanStep } from '../../../api/clients/es-loan-registration/models/es-loan-step';
import { EsLoanStateModel } from '../../../api/clients/es-loan-registration/models/es-loan-get-steps.response';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EsLoanRegistrationService {
  creditId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  registrationId: BehaviorSubject<string> = new BehaviorSubject('');
  steps: BehaviorSubject<EsLoanStep[]> = new BehaviorSubject<EsLoanStep[]>([]);
  requestAmount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  esLoanStateModel: BehaviorSubject<EsLoanStateModel | null> = new BehaviorSubject<EsLoanStateModel | null>(null);

  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  getStep() {
    this.esLoanRegistrationApiService.getSteps().subscribe({
      next: (stepRes) => {
        this.steps.next(stepRes.steps);
        this.requestAmount.next(stepRes.requestAmount);
        this.esLoanStateModel.next(stepRes.esLoanStateModel);
      }
    });
  }
}
