import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeyValuePair } from '../../../../../models/utility.model';
import { PersianTime } from '../../../../../../../util/persian-time';
import { PersianTimeModel } from '../../../../../models/persian-date.model';
import { NgForOf } from '@angular/common';
import { UiSchedulerComponent } from '../../../../../../../components/ui-scheduler/ui-scheduler/ui-scheduler.component';
import { PolicyGeneralInfoComponent } from '../../../../../applets/policy-general-info/policy-general-info.component';
import { UiButtonComponent } from '../../../../../../../components/ui-button/ui-button/ui-button.component';
import { Purchase } from '../../../../../api/models/policy-inquiry/policy-inquiry.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'inquiry-lead-has-time',
  templateUrl: './inquiry-lead-has-time.component.html',
  styleUrls: ['./inquiry-lead-has-time.component.scss'],
  imports: [
    RouterLink,
    NgForOf,
    UiSchedulerComponent,
    PolicyGeneralInfoComponent,
    UiButtonComponent
  ],
  standalone: true
})
export class InquiryLeadHasTimeComponent implements OnInit {

  @Input()
  purchase: Purchase;

  policyInformationList: KeyValuePair[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.createList();
  }

  createList(): void {
    const createAt = this.purchase.orderedAt ? new PersianTime(this.purchase.orderedAt).convert(PersianTimeModel.YYYY_MD_HM) : '--';
    this.policyInformationList.push({key: 'شماره بیمه‌گر', value: this.ifExist(this.purchase.policyHolder.mobile)});
    this.policyInformationList.push({key: 'تاریخ خرید دستگاه', value: createAt});
  }

  ifExist(value): string {
    return value ? value : ' -- ';
  }

  back(): void {
    window.location.href = 'https://app.mydigipay.com/' + INSURANCE_APP_PREFIX;
  }
}
