import { Component, OnInit } from '@angular/core';
import { UiButtonComponent } from '../../../../../../../components/ui-button/ui-button/ui-button.component';
import { INSURANCE_APP_PREFIX } from '../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'inquiry-no-policy',
  templateUrl: './inquiry-no-policy.component.html',
  styleUrls: ['./inquiry-no-policy.component.scss'],
  imports: [
    UiButtonComponent

  ],
  standalone: true
})
export class InquiryNoPolicyComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  back(): void {
    window.location.href = 'https://app.mydigipay.com/' + INSURANCE_APP_PREFIX;
  }
}
