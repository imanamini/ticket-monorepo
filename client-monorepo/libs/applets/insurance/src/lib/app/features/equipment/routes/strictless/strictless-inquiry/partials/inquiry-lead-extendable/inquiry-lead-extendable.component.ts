import { Component, Input, OnInit } from '@angular/core';
import { Purchase } from '../../../../../api/models/policy-inquiry/policy-inquiry.model';

@Component({
  selector: 'inquiry-lead-extendable',
  templateUrl: './inquiry-lead-extendable.component.html',
  styleUrls: ['./inquiry-lead-extendable.component.scss'],
  standalone: true
})
export class InquiryLeadExtendableComponent implements OnInit {

  @Input()
  purchase: Purchase;

  constructor() {
  }

  ngOnInit(): void {
  }

  openEmail(): void {
    window.open('mailto:support@mydigipay.com');
  }
}
