import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../../../registration.service';
import {
  GetTicketDetailResponse
} from '../../../../../../../api/clients/registration/response-models/get-ticket-detail.response';
import { StepBase } from '../../../step-base';
import { MessageService } from '../../../../../../../core/message.service';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SmartDialog } from '../../../../../../../user-interface/services/smart-dialog';
import {
  AccountConfirmInfoDialogComponent
} from '../account-confirm-info-dialog/account-confirm-info-dialog.component';

@Component({
  selector: 'account-confirm-info',
  templateUrl: './account-confirm-info.component.html',
  styleUrls: ['./account-confirm-info.component.scss']
})
export class AccountConfirmInfoComponent extends StepBase implements OnInit {

  items: { label: string, value: any }[] = [];
  agreed = false;

  constructor(
    private service: RegistrationService,
    private messageService: MessageService,
    private smartDialog: SmartDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getTicketDetail().subscribe(details => {
      if (details) {
        this.setItems(details);
      }
    });
  }

  private setItems(details: GetTicketDetailResponse): void {
    const i = details.registration.identityInfo;
    this.items = [
      {label: 'کد ملی', value: i.nationalCode},
      {label: 'نام و نام خانوادگی', value: i.name},
      {label: 'شماره همراه', value: details.registration.cellNumber},
      {label: 'نام پدر', value: i.fatherName},
      {label: 'تاریخ تولد', value: i.birthDate},
      {label: 'نحوه افتتاح حساب', value: 'آنلاین'},
    ];
  }

  proceed() {
    this.service.submitUserInformation().pipe(
      switchMap(res => {
        this.nextStep.emit();
        return of(null);
      }),
      catchError(e => {
        this.messageService.showMessageOfResponse(e);
        return of(null);
      })
    ).subscribe();
  }

  showTac() {
    this.smartDialog.open(AccountConfirmInfoDialogComponent);
  }

  callSupport() {
    window.open('tel:+982153924000');
  }
}
