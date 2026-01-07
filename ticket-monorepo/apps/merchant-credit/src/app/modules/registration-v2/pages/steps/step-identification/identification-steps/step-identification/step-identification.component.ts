import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../../../../registration.service';
import {
  GetTicketDetailResponse
} from '../../../../../../../api/clients/registration/response-models/get-ticket-detail.response';
import moment from 'jalali-moment';
import { StepBase } from '../../../step-base';
import { MessageService } from '../../../../../../../core/message.service';
import {
  ConfigAction,
  ErrorStatus,
  InitializeIdentityEvaluationConfig
} from '../../../../../../../api/models/registration/initializeIdentityEvaluationConfig';

@Component({
  selector: 'step-identification',
  templateUrl: './step-identification.component.html',
  styleUrls: ['./step-identification.component.scss']
})
export class StepIdentificationComponent extends StepBase implements OnInit {

  form: UntypedFormGroup;

  details!: GetTicketDetailResponse;

  updateTimeout: number | null = null;

  enableAction = false;

  cellNumber = '';

  formattedDate = '';

  sendingData = false;

  noServiceErrorData: any;

  isError = false;

  route: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private registrationService: RegistrationService,
  ) {
    super();
    this.form = this.formBuilder.group({
      identityNumber: [''],
      birthdate: ['', [
        Validators.required
      ]],
    });
  }

  ngOnInit(): void {
    this.registrationService.getTicketDetail().subscribe(details => {
      if (details) {
        this.details = details;
        this.cellNumber = details.registration.agent.registerCellNumber;
        this.form.patchValue({
          identityNumber: details.registration.nationalCode
        });
        this.form.controls.identityNumber.disable();
      }
    });

    this.form.valueChanges.subscribe(value => {
      if (value.birthdate) {
        this.formattedDate = moment(value.birthdate).format('jYYYY/jMM/jDD');

        if (this.updateTimeout) {
          clearTimeout(this.updateTimeout);
        }
        this.updateTimeout = setTimeout(() => {
          if (/^\d{4}\/\d{2}\/\d{2}$/.test(this.formattedDate)) {
            this.registrationService.updatePersonInfo({
              birthDate: this.formattedDate
            });
            this.enableAction = true;
          }
        });
      }
    });
  }

  // Validate the form fields if person birth date is at least 18 years old
  validateDateOfBirth(control: FormControl): { [key: string]: any } | null {
    if (control.value) {
      const dateOfBirth = control.value;
      const ageDifMs = Date.now() - dateOfBirth;
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      // check if date is valid and person is at least 18 years old
      if (isNaN(dateOfBirth) || age < 18) {
        return {'invalidDateOfBirth': true};
      }
    }
    return null;

  }

  proceed() {
    if (this.sendingData) {
      return;
    }
    this.sendingData = true;
    this.registrationService.initializeIdentityEvaluation(this.formattedDate).then(res => {
      this.nextStep.emit();
      this.sendingData = false;
    }).catch(e => {
      const errorStatus: ErrorStatus = e?.error?.result?.status;
      const action: ConfigAction = InitializeIdentityEvaluationConfig[errorStatus];
      if (action) {
        this.isError = true;
        this.noServiceErrorData = action;
      } else {
        this.messageService.showErrorIfExists(e);
      }
      this.sendingData = false;
    });
  }

  onRetry() {
    this.isError = false;
  }

  onExit() {
    this.registrationService.goToOverviewPage();
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.onRetry();
    } else if (id === 'secondary') {
      this.onExit();
    }
  }
}
