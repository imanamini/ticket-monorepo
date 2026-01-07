import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UiButtonComponent } from '../../../../../../../components/ui-button/ui-button/ui-button.component';
import { INSURANCE_APP_PREFIX } from '../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'inquiry-policy-pure',
  templateUrl: './inquiry-policy-pure.component.html',
  styleUrls: ['./inquiry-policy-pure.component.scss'],
  imports: [
    UiButtonComponent
  ],
  standalone: true
})
export class InquiryPolicyPureComponent implements OnInit {

  @Output()
  transferPurePolicy = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  transfer(): void {
    this.transferPurePolicy.emit();
  }

  back(): void {
    window.location.href = 'https://app.mydigipay.com/' + INSURANCE_APP_PREFIX;
  }
}
