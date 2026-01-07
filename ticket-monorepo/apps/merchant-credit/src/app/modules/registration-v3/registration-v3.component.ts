import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MERCHANT_TYPE } from '../../api/clients/registration/basic-models/merchant.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../core/message.service';
import { SmartDialog } from '../../user-interface/services/smart-dialog';
import { FactoryService } from './services/factory.service';
import { RegistrationV3Service } from './services/registration-v3.service';
import { StepUID } from '../../api/clients/registration-v3/basic-models/registration-v3-step.model';
import { TicketService } from '../../core/ticket.service';
import { RegistrationApiService } from '../../api/clients/registration/registration-api.service';
import { Observable, Subscription } from 'rxjs';
import { HeaderProfileViewDialogComponent } from './components';

@Component({
  selector: 'registrationV3Service-v3',
  templateUrl: './registration-v3.component.html',
  styleUrls: ['./registration-v3.component.scss']
})
export class RegistrationV3Component implements OnInit {

  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;
  private subscription!: Subscription;
  steps: any[] = [];
  currentStepIndex: number = 0;
  creditId: string = '';
  type: MERCHANT_TYPE = 0;
  details: any;

  private lastFetchedSteps: { [key: string]: any } = {};
  private lastFetchedDetails: { [key: string]: any } = {};
  private gettingSteps: { [key: string]: boolean } = {};
  private gettingDetails: { [key: string]: boolean } = {};

  constructor(private activatedRoute: ActivatedRoute,
              private registrationV3Service: RegistrationV3Service,
              private messageService: MessageService,
              private smartDialog: SmartDialog,
              private ticketService: TicketService,
              private registrationApiService: RegistrationApiService,
              private factoryService: FactoryService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.creditId = this.activatedRoute.snapshot.queryParams.creditId;
    this.getData(this.creditId).subscribe();

    this.subscription = this.factoryService.eventData$.subscribe(data => {
      this.getData(this.creditId).subscribe();
    });
  }

  getData(creditId: string): Observable<any> {
    return new Observable(subscriber => {
      const lastSteps = this.lastFetchedSteps[creditId];
      const lastDetails = this.lastFetchedDetails[creditId];

      this.gettingSteps[creditId] = true;
      this.gettingDetails[creditId] = true;

      this.registrationV3Service.getDetails(creditId).then((detailsRes) => {
        if (JSON.stringify(detailsRes) !== JSON.stringify(lastDetails)) {
          this.lastFetchedDetails[creditId] = detailsRes;
          this.type = detailsRes.registration.type;
          this.details = detailsRes;
          this.createComponent(this.container, this.steps, this.details, creditId, this.type);
        } else {
          this.gettingDetails[creditId] = false;
          subscriber.next({steps: this.steps, details: this.details});
          subscriber.complete();
        }
      });

      this.registrationV3Service.getSteps(creditId)
        .then(stepsRes => {
          if (JSON.stringify(stepsRes) !== JSON.stringify(lastSteps)) {
            this.lastFetchedSteps[creditId] = stepsRes;
            this.steps = stepsRes.steps;
            this.currentStepIndex = stepsRes.currentStep;
            const zeroStep = -1;
            if (this.currentStepIndex === zeroStep) {
              this.router.navigateByUrl('/early-settlement/list');
              return;
            }
            this.createComponent(this.container, this.steps, this.details, creditId, this.type);
            subscriber.next({steps: this.steps, details: this.details});

            this.gettingSteps[creditId] = false;
            this.gettingDetails[creditId] = false;

            subscriber.complete();
          } else {
            this.gettingSteps[creditId] = false;
            subscriber.next({steps: this.steps, details: this.details});
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

  createComponent(container: ViewContainerRef, steps: any, details: any, creditId: string, type: number) {
    const page: StepUID = this.steps[this.currentStepIndex].uid;
    this.factoryService.createComponent(page, container, steps, details, creditId, type);
  }

  closeClick() {
    window.history.back();
  }

  profileClick() {
    this.smartDialog.open(HeaderProfileViewDialogComponent, {
      details: this.details
    });
  }
}
