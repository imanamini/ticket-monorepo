import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../../../../../components/ui-button/ui-button/ui-button.component';
import { INSURANCE_APP_PREFIX } from '../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'inquiry-policy-holder',
  templateUrl: './inquiry-policy-holder.component.html',
  styleUrls: ['./inquiry-policy-holder.component.scss'],
  imports: [
    RouterLink,
    UiButtonComponent
  ],
  standalone: true
})
export class InquiryPolicyHolderComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  back(): void {
    window.location.href = 'https://app.mydigipay.com/' + INSURANCE_APP_PREFIX;
  }
}
