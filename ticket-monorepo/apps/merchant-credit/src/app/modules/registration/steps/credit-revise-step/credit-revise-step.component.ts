import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MERCHANT_TYPE } from '../../../../api/clients/registration/basic-models/merchant.type';
import { RegistrationApiService } from '../../../../api/clients/registration/registration-api.service';
import { RegistrationStatus } from '../../../../api/clients/registration/basic-models/registration-status';
import { Detail } from '../../../../api/clients/registration/basic-models/step';
import { MessageService } from '../../../../core/message.service';

@Component({
  selector: 'app-credit-revise-step',
  templateUrl: './credit-revise-step.component.html',
  styleUrls: ['./credit-revise-step.component.scss']
})
export class CreditReviseStepComponent {

  @Input()
  type: MERCHANT_TYPE = 0;

  @Input()
  detail!: Detail;

  @Input()
  creditId: string = '';

  @Input()
  registrationMaxAmount: number = 0;

  @Output()
  reloadData = new EventEmitter();

  @Input()
  registrationStatus: RegistrationStatus = 0;

  @Output()
  cancel = new EventEmitter();

  newMaxAmount: number = 0;
  iban: string = '';
  isFormValid: boolean = false;
  activeSection: 'select-doc' | 'result' = 'select-doc';

  get hideMode(): boolean {
    return this.registrationStatus === RegistrationStatus.REJECTED || this.registrationStatus === RegistrationStatus.CANCELED;
  }

  constructor(
    private registrationApiService: RegistrationApiService,
    private messageService: MessageService,
  ) {
  }

  onSubmit() {
    this.registrationApiService.reviseMaxAmount(this.creditId, this.newMaxAmount, this.iban).subscribe(() => {
      this.reloadData.emit();
    }, error => {
      this.messageService.showErrorIfExists(error);
    });
  }

  getData(event: any) {
    if (event) {
      this.isFormValid = event.isValid;
      this.iban = event.value.iban;
    }
  }
}
