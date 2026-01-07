import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../registration.service';
import { RegistrationState } from '../../../../../api/models/registration/states';
import { MessageService } from '../../../../../core/message.service';
import { of, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'step-credit-score',
  templateUrl: './step-credit-score.component.html',
  styleUrls: ['./step-credit-score.component.scss']
})
export class StepCreditScoreComponent implements OnInit {

  scoreRejected = false;
  retryCountOnError = 0;

  constructor(
    private service: RegistrationService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getStatus();
  }

  //CHECK
  getStatus(): void {
    from(this.service.getStepsFromApi()).pipe(
      switchMap(res => {
        const state = res.currentStep as RegistrationState;
        if (state === RegistrationState.ICS_REJECTED || state === RegistrationState.ICS_CELL_NUMBER_INQUIRY_REJECTED) {
          // rejected, display a proper message
          this.scoreRejected = true;
          return of(null); // Emit null to complete the observable chain
        }
        if (state !== RegistrationState.ICS) {
          // state changed, and it is not a REJECTED state, get back to overview page
          this.goBack();
          return of(null); // Emit null to complete the observable chain
        }
        setTimeout(() => {
          this.getStatus(); // Retry after 5 seconds
        }, 5000);
        return of(null); // Emit null to complete the observable chain
      }),
      catchError(err => {
        if (this.retryCountOnError >= 3) {
          this.messageService.showErrorIfExists(err);
          this.goBack();
          return of(null); // Emit null to complete the observable chain
        }
        setTimeout(() => {
          this.retryCountOnError++;
          this.getStatus(); // Retry after 2 seconds
        }, 2000);
        return of(null); // Emit null to complete the observable chain
      })
    ).subscribe();
  }

  goBack(): void {
    this.service.goToOverviewPage();
  }
}
