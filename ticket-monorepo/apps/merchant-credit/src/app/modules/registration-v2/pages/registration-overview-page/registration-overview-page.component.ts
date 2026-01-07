import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegistrationPages } from '../../models/registration-pages';
import { RegistrationService } from '../../registration.service';
import { Step } from '../../../../api/clients/registration/basic-models/step';
import { StepsHeader } from '../../../../api/clients/registration/response-models/get-steps.response';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/config.service';
import { FLOW_STATUS } from '../../../../api/models/registration/states';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'registration-overview-page',
  templateUrl: './registration-overview-page.component.html',
  styleUrls: ['./registration-overview-page.component.scss']
})
export class RegistrationOverviewPageComponent implements OnInit, OnDestroy {

  steps: Step[] = [];

  headerDetails: { label: string, value: string }[] = [];

  stepsHeader: StepsHeader | null = null;

  currentStepName = '';

  activeStepIndex = -1;

  subscriptions: Subscription[] = [];

  flowStatus: FLOW_STATUS = FLOW_STATUS.ACTIVE;

  flowStatusEnum = FLOW_STATUS;

  constructor(
    private service: RegistrationService,
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService
  ) {
  }

  ngOnInit(): void {
    this.service.setPage(RegistrationPages.OVERVIEW);

    this.subscriptions[0] = this.service.getTicketDetail().subscribe(details => {
      if (details) {
        this.service.getAndSetStepsData();
      }
    });

    this.subscriptions[1] = this.service.steps.subscribe(steps => {
      if (steps) {
        this.steps = steps;
      }
    });

    this.subscriptions[2] = this.service.stepsHeader.subscribe(header => {
      if (!header) {
        return;
      }
      this.stepsHeader = header;
      this.headerDetails = [
        {label: header?.bottomRightLabel, value: header?.bottomRightValue},
        {label: header?.bottomLeftLabel, value: header?.bottomLeftValue},
      ];
    });

    this.subscriptions[3] = this.service.currentStep.subscribe(currentStepName => {
      this.currentStepName = currentStepName;
      this.steps.forEach((step, si) => {
        if (step.uid === currentStepName) {
          this.activeStepIndex = si;
        }
      });
    });

    this.subscriptions[4] = this.service.flowStatus.subscribe(flowStatus => {
      this.flowStatus = flowStatus;
      if (flowStatus === FLOW_STATUS.PENDING) {
        setTimeout(() => {
          this.service.getAndSetStepsData();
        }, 5000);
      }
      if (flowStatus === FLOW_STATUS.FINISHED) {
        this.router.navigateByUrl('/early-settlement/list').then();
      }
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  onStepActionClick(step: Step): void {
    if (step.uid !== this.currentStepName) {
      // user is somehow managed to click on action of a step that is not enabled, something is wrong...
      // ignore these cases.
      return;
    }

    this.service.nextPage();

  }

  exit(): void {
    const ticket = this.storage.getTicket();
    this.router.navigate([`activation/${ticket}/home`]);
  }
}
