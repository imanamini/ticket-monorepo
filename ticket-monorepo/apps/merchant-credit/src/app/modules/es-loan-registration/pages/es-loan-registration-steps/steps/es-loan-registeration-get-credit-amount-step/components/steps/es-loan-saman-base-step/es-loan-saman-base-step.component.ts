import { Component, input, output, ViewChild, ViewContainerRef } from '@angular/core';
import { MERCHANT_TYPE } from '../../../../../../../../../api/clients/registration/basic-models/merchant.type';
import {
  GetTicketDetailResponse
} from '../../../../../../../../../api/clients/registration/response-models/get-ticket-detail.response';
import {
  RegistrationStatus
} from '../../../../../../../../../api/clients/registration/basic-models/registration-status';
import {
  RegistrationStep
} from '../../../../../../../../../api/clients/registration-v3/basic-models/registration-v3-step.model';

@Component({
  selector: 'es-loan-saman-base-step',
  templateUrl: './es-loan-saman-base-step.component.html',
  styleUrl: './es-loan-saman-base-step.component.scss'
})
export class EsLoanSamanBaseStepComponent {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;

  steps = input<RegistrationStep[]>([]);
  currentStepIndex = input<number>(0);
  type = input<MERCHANT_TYPE>(0);
  creditId = input<string>('');
  status = input<RegistrationStatus>(0);
  details = input<GetTicketDetailResponse>({} as GetTicketDetailResponse);

  reloadCloseEvent = output<boolean>();
  reloadDataEvent = output<boolean>();
}
