import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Step } from '../../../api/clients/registration/basic-models/step';
import { RegistrationStatus } from '../../../api/clients/registration/basic-models/registration-status';
import { numberMapper } from '../../../api/clients/registration/basic-models/numberMapper';
import { StepTagData } from './step-tag-data';

type StepStatus = 'active' | 'success' | 'disabled' | 'rejected';

interface TransformedStep extends Step {
  status: StepStatus;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, OnChanges {
  @Input() steps: Step[] = [];
  @Input() currentIndex: number = 0;
  @Input() status: RegistrationStatus = 0;

  numberMapper = numberMapper;
  transformedSteps: TransformedStep[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.steps || changes.currentIndex) {
      this.transformSteps();
    }
  }

  private transformSteps() {
    this.transformedSteps = this.steps.map((step, index) => {
      let status: StepStatus = 'disabled';
      if (index < this.currentIndex) {
        status = 'success';
      }
      if (index === this.currentIndex && this.status === RegistrationStatus.PENDING) {
        status = 'active';
      }
      if (index === this.currentIndex && this.status === RegistrationStatus.REJECTED) {
        status = 'rejected';
      }
      if (index === this.currentIndex && this.status === RegistrationStatus.REJECTED) {
        status = 'rejected';
      }
      if (index === this.currentIndex && this.status === RegistrationStatus.CANCELED) {
        status = 'rejected';
      }
      return Object.assign({}, step, {
        status,
        tag: (StepTagData[step.uid] && StepTagData[step.uid][status]) ? StepTagData[step.uid][status] : step.tag,
      });
    });
  }
}
