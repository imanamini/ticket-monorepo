import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Step } from '../../../api/clients/registration/basic-models/step';
import { FLOW_STATUS } from '../../../api/models/registration/states';

@Component({
  selector: 'flow-step',
  templateUrl: './flow-step.component.html',
  styleUrls: ['./flow-step.component.scss']
})
export class FlowStepComponent implements OnInit {

  @Input()
  isActive = false;

  @Input()
  isPassed = false;

  @Input()
  isLastStep = false;

  @Input()
  step!: Step;

  @Input()
  flowStatus: FLOW_STATUS = FLOW_STATUS.ACTIVE;

  flowStatusEnum = FLOW_STATUS;

  flowStatusToClassMap = {
    [FLOW_STATUS.ACTIVE]: 'flow-active',
    [FLOW_STATUS.PENDING]: 'flow-pending',
    [FLOW_STATUS.REJECTED]: 'flow-rejected',
    [FLOW_STATUS.FINISHED]: 'flow-finished',
  }

  @Output()
  actionClicked = new EventEmitter<Step>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onActionClick(): void {
    this.actionClicked.next(this.step);
  }

  protected readonly FLOW_STATUS = FLOW_STATUS;
}
