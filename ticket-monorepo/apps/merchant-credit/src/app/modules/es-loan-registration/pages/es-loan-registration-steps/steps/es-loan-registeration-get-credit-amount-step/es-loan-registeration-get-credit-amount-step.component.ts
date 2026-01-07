import { ChangeDetectionStrategy, Component, inject, model, signal, ViewChild, ViewContainerRef } from '@angular/core';
import {
  EsLoanRegistrationBaseStepComponent
} from '../es-loan-registration-base-step/es-loan-registration-base-step.component';
import { Observable, Subscription } from 'rxjs';
import { MERCHANT_TYPE } from '../../../../../../api/clients/registration/basic-models/merchant.type';
import { EsLoanSamanFactoryService } from './services/es-loan-saman-factory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';
import { MessageService } from '../../../../../../core/message.service';
import { EsLoanSamanService } from './services/es-loan-saman.service';
import { EsLoanRegistrationService } from '../../../../services/es-loan-registration.service';
import { EsLoanStep } from '../../../../../../api/clients/es-loan-registration/models/es-loan-step';
import {
  GetTicketDetailResponse
} from '../../../../../../api/clients/registration/response-models/get-ticket-detail.response';
import { StepUID } from '../../../../../../api/clients/es-loan-registration/models/es-loan-saman.model';
import {
  RegistrationStep
} from '../../../../../../api/clients/registration-v3/basic-models/registration-v3-step.model';

@Component({
  selector: 'es-loan-registeration-get-credit-amount-step',
  templateUrl: './es-loan-registeration-get-credit-amount-step.component.html',
  styleUrl: './es-loan-registeration-get-credit-amount-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegisterationGetCreditAmountStepComponent extends EsLoanRegistrationBaseStepComponent {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;

  registrationSteps = model<RegistrationStep[]>([]);
  currentStepIndex = signal<number>(0);
  creditId = signal<string>('');
  type = signal<MERCHANT_TYPE>(0);
  details = signal<GetTicketDetailResponse>({} as GetTicketDetailResponse);

  private subscription!: Subscription;
  private lastFetchedSteps: { [key: string]: any } = {};
  private lastFetchedDetails: { [key: string]: any } = {};
  private gettingSteps: { [key: string]: boolean } = {};
  private gettingDetails: { [key: string]: boolean } = {};

  esLoanSamanService = inject(EsLoanSamanService);
  messageService = inject(MessageService);
  smartDialog = inject(SmartDialog);
  factoryService = inject(EsLoanSamanFactoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  registrationService = inject(EsLoanRegistrationService);

  ngOnInit(): void {
    this.registrationService.creditId.subscribe((creditId) => {
      if (creditId) {
        this.creditId.set(creditId);
        this.getData(this.creditId()).subscribe();
      } else {
        this.creditId.set(this.route.snapshot.paramMap.get('creditId')!);
        this.getData(this.creditId()).subscribe();
      }
    });

    this.subscription = this.factoryService.eventData$.subscribe(data => {
      this.getData(this.creditId()).subscribe();
    });
  }

  getData(creditId: string): Observable<any> {
    return new Observable(subscriber => {
      const lastSteps = this.lastFetchedSteps[creditId];
      const lastDetails = this.lastFetchedDetails[creditId];

      this.gettingSteps[creditId] = true;
      this.gettingDetails[creditId] = true;

      this.esLoanSamanService.getDetails(creditId).then((detailsRes) => {
        if (JSON.stringify(detailsRes) !== JSON.stringify(lastDetails)) {
          this.lastFetchedDetails[creditId] = detailsRes;
          this.type.set(detailsRes.registration.type);
          this.details.set(detailsRes);
          this.createComponent(this.container, this.steps(), this.registrationSteps(), this.details(), creditId, this.type());
        } else {
          this.gettingDetails[creditId] = false;
          subscriber.next({steps: this.registrationSteps(), details: this.details()});
          subscriber.complete();
        }
      });

      this.esLoanSamanService.getSteps(creditId)
        .then(stepsRes => {
          if (JSON.stringify(stepsRes) !== JSON.stringify(lastSteps)) {
            this.lastFetchedSteps[creditId] = stepsRes;
            this.registrationSteps.set(stepsRes.steps);
            this.currentStepIndex.set(stepsRes.currentStep);
            const zeroStep = -1;
            if (this.currentStepIndex() === zeroStep) {
              this.router.navigate(['/es-loan-registration/overview'], {
                replaceUrl: true
              });
              return;
            }
            this.createComponent(this.container, this.steps(), this.registrationSteps(), this.details(), creditId, this.type());
            subscriber.next({steps: this.steps(), details: this.details()});

            this.gettingSteps[creditId] = false;
            this.gettingDetails[creditId] = false;

            subscriber.complete();
          } else {
            this.gettingSteps[creditId] = false;
            subscriber.next({steps: this.steps(), details: this.details()});
            subscriber.complete();
          }
        })
        .catch(error => {
          this.messageService.showErrorIfExists(error);
          this.gettingSteps[creditId] = false;
          this.gettingSteps[creditId] = false;
          subscriber.error(error);
        });
    });
  }

  createComponent(container: ViewContainerRef, steps: EsLoanStep[], registrationStep: RegistrationStep[], details: GetTicketDetailResponse, creditId: string, type: number) {
    const page: StepUID = this.registrationSteps()[this.currentStepIndex()]?.uid;
    if (page) {
      this.factoryService.createComponent(container, page, steps, registrationStep, details, creditId, type);
    }
  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

}
