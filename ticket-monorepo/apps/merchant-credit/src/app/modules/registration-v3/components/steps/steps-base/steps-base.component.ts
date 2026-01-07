import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MERCHANT_TYPE } from '../../../../../api/clients/registration/basic-models/merchant.type';
import {
  GetTicketDetailResponse
} from '../../../../../api/clients/registration/response-models/get-ticket-detail.response';
import { RegistrationStatus } from '../../../../../api/clients/registration/basic-models/registration-status';

@Component({
  selector: 'steps-base',
  templateUrl: './steps-base.component.html',
  styleUrls: ['./steps-base.component.scss']
})
export class StepsBaseComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef, static: true}) container!: ViewContainerRef;

  @Output() reloadDataEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() type: MERCHANT_TYPE = 0;
  @Input() steps: any[] = [];
  @Input() details!: GetTicketDetailResponse;
  @Input() creditId: string = '';
  @Input() currentStepIndex: number = 0;
  @Input() status: RegistrationStatus = 0;

  constructor() {
  }

  ngOnInit(): void {

  }

}
