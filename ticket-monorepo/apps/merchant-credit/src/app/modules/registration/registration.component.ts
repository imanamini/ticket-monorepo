import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrationApiService } from '../../api/clients/registration/registration-api.service';
import { Detail, Step } from '../../api/clients/registration/basic-models/step';
import { RegistrationStatus } from '../../api/clients/registration/basic-models/registration-status';
import { MERCHANT_TYPE } from '../../api/clients/registration/basic-models/merchant.type';
import { MessageService } from '../../core/message.service';
import {TicketService} from '../../core/ticket.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  steps: Step[] = [];
  detail!: Detail;
  currentStepIndex: number = 0;
  status: RegistrationStatus = 0;
  gettingData: boolean = false;
  creditId: string = '';
  type: MERCHANT_TYPE = 0;
  cancelMode = false;
  registrationMaxAmount: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private registrationApiService: RegistrationApiService,
    private messageService: MessageService,
    private ticketService: TicketService
  ) {
  }

  ngOnInit(): void {
    this.creditId = this.activatedRoute.snapshot.queryParams.creditId;
    this.getData(this.creditId);
  }

  getData(creditId: string) {
    this.gettingData = true;
    this.ticketService.getTicketDetail(creditId).subscribe(ticketDetail => {
      this.registrationApiService.getSteps(ticketDetail.registration.creditId).subscribe(stepsResponse => {
        this.type = ticketDetail.registration.type;
        this.steps = stepsResponse.steps;
        this.detail = this.steps[0].detail;
        this.currentStepIndex = stepsResponse.currentStep;
        this.status = ticketDetail.registration.status;
        this.registrationMaxAmount = ticketDetail.registration.maxCreditAmount;
        this.gettingData = false;
      });
    }, error => {
      this.messageService.showErrorIfExists(error);

    });
  }
  goToCancel() {
    this.cancelMode = true;
  }

}
