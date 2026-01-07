import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { EsLoanRegistrationFactoryService } from '../../services/es-loan-registration-factory.service';
import { EsLoanStepUID } from '../../../../api/clients/es-loan-registration/models/es-loan-registration-model';
import { EsLoanRegistrationService } from '../../services/es-loan-registration.service';
import { EsLoanStep } from '../../../../api/clients/es-loan-registration/models/es-loan-step';
import { EsLoanStateModel } from '../../../../api/clients/es-loan-registration/models/es-loan-get-steps.response';
import { MessageService } from '../../../../core/message.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'es-loan-registration-steps',
  templateUrl: './es-loan-registration-steps.component.html',
  styleUrl: './es-loan-registration-steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationStepsComponent implements OnInit, OnDestroy {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;
  private subscription!: Subscription;

  steps = signal<EsLoanStep[]>([]);
  esLoanStateModel = signal<EsLoanStateModel>({} as EsLoanStateModel);

  factoryService = inject(EsLoanRegistrationFactoryService);
  esLoanRegistrationService = inject(EsLoanRegistrationService);
  esLoanRegistrationFactoryService = inject(EsLoanRegistrationFactoryService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.getSteps();
    this.esLoanRegistrationService.getStep();
    this.subscription = this.esLoanRegistrationFactoryService.eventData$.subscribe(data => {
      this.esLoanRegistrationService.getStep();
    });
  }

  getSteps() {
    combineLatest([
      this.esLoanRegistrationService.steps,
      this.esLoanRegistrationService.esLoanStateModel,
      this.esLoanRegistrationService.requestAmount
    ]).subscribe(([steps, esLoanStateModel, requestAmount]) => {
      if (steps.length > 0 && esLoanStateModel) {
        const currentStep = esLoanStateModel.activeStep;
        const page: EsLoanStepUID = steps[currentStep].uid;
        const amount = requestAmount;
        this.factoryService.createComponent(page, this.container, steps, esLoanStateModel, amount);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
