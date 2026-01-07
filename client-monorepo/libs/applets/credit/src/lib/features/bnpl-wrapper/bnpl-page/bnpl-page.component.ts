import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CreditWindowPaymentService } from '../../../data-access/services/credit-window-payment.service';
import { RouterOutlet } from '@angular/router';
import { CreditServiceTypeService } from '../../credit/data-access/services/credit-service-type.service';

@Component({
  selector: 'app-bnpl-page',
  templateUrl: './bnpl-page.component.html',
  styleUrls: ['./bnpl-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class BnplPageComponent implements OnInit {
  creditWindowPaymentService = inject(CreditWindowPaymentService);
  serviceTypeService = inject(CreditServiceTypeService);

  ngOnInit(): void {
    this.serviceTypeService.setServiceType('bnpl');
    this.creditWindowPaymentService.attachCreditPayment();
  }
}
