import { Component, Input, OnInit } from '@angular/core';
import { RegistrationStatus } from '../../../../api/clients/registration/basic-models/registration-status';
import { ResultItem, stepResultData, stepResultDataLegal } from './step-result-data';
import { MERCHANT_TYPE } from '../../../../api/clients/registration/basic-models/merchant.type';
import { DocumentItem } from '../../../../api/models/registration/pages/limitation/limitation.model';
import { RegistrationService } from '../../services/registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-result',
  templateUrl: './step-result.component.html',
  styleUrls: ['./step-result.component.scss']
})
export class StepResultComponent implements OnInit {

  @Input()
  stepUID: string = '';

  @Input()
  registrationStatus: RegistrationStatus = 0;

  @Input()
  type: MERCHANT_TYPE = 0;

  @Input()
  registrationMaxAmount: number = 0;

  @Input()
  successful: boolean = false;

  status: 'success' | 'pending' | 'failed' = 'pending';
  title: string = '';
  description: string = '';
  icon: string = '';
  showBoxes: boolean = true;
  requiredDocuments: DocumentItem[] = [];
  warningMessage: string = '';
  statusMap: { [key: number]: 'success' | 'pending' | 'failed' } = {
    [RegistrationStatus.APPROVED]: 'success',
    [RegistrationStatus.PENDING]: 'pending',
    [RegistrationStatus.REJECTED]: 'failed',
    [RegistrationStatus.CANCELED]: 'failed',
  };
  hiddenMode: boolean = false;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    let data: ResultItem;
    if (this.successful) {
      this.router.navigateByUrl('/early-settlement/list');
      return;
    }
    const resultData = this.type === MERCHANT_TYPE.LEGAL ? stepResultDataLegal : stepResultData;
    data = resultData[this.stepUID] ? resultData[this.stepUID][this.registrationStatus] : null;
    if (data) {
      this.title = data.title;
      this.description = data.description;
      this.icon = data.icon || '';
      this.showBoxes = data.showBoxes;
      this.warningMessage = data.warningMessage || '';
      this.status = this.statusMap[this.registrationStatus];
      this.requiredDocuments = this.registrationService.amountToDocuments(this.type, this.registrationMaxAmount);
      this.hiddenMode = false;
    } else {
      this.hiddenMode = true;
    }
  }

}
