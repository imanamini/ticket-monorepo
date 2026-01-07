import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { numberMapper } from '../../../../api/clients/registration/basic-models/numberMapper';
import { RegistrationStatus } from '../../../../api/clients/registration/basic-models/registration-status';
import { StepTagData } from '../../../registration/stepper/step-tag-data';
import { RegistrationStep } from '../../../../api/clients/registration-v3/basic-models/registration-v3-step.model';

type StepStatus = 'active' | 'success' | 'disabled' | 'rejected';

interface TransformedStep extends RegistrationStep {
  status: StepStatus;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, OnChanges {
  @Input() steps: RegistrationStep[] = [];

  @Input() currentIndex: number = 0;

  @Input() status: RegistrationStatus = 0;

  @Output() submit = new EventEmitter();
  @Output() back = new EventEmitter();
  transformedSteps: TransformedStep[] = [];
  numberMapper = numberMapper;

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
