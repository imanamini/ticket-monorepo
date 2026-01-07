import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SmartDialog } from '../../../../../user-interface/services/smart-dialog';
import { IcsMoreInfoDialogComponent } from '../ics-step/ics-more-info-dialog/ics-more-info-dialog.component';
import { StepsBaseComponent } from '../steps-base/steps-base.component';
import {
  ICS_STATES,
  StepResultConfig
} from '../../../../../api/models/registration-v3/step-result-config';
import { StepConfigAction } from '../../../../../api/clients/registration-v3/basic-models/step-result-config.model';

@Component({
  selector: 'app-identity-evaluation-step',
  templateUrl: './identity-evaluation-step.component.html',
  styleUrls: ['./identity-evaluation-step.component.scss']
})
export class IdentityEvaluationStepComponent extends StepsBaseComponent implements OnInit {
  @Output() reloadDataEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  errorData: any;
  errorStatus!: ICS_STATES;

  constructor(
    private smartDialog: SmartDialog
  ) {
    super();

  }

  ngOnInit(): void {
    this.errorStatus = this.details?.registration?.currentState;
    const action: StepConfigAction = StepResultConfig[this.errorStatus];
    if (action) {
      this.errorData = action;
    }
    this.changeStep();
  }

  changeStep() {
    setTimeout(() => {
      this.reloadDataEvent.emit(true);
    }, 60000);
  }

  closeClick() {
    window.history.back();
  }

  moreInfoClick() {
    this.smartDialog.open(IcsMoreInfoDialogComponent);
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.closeClick();
    } else if (id === 'secondary') {
      this.moreInfoClick();
    }
  }

}
