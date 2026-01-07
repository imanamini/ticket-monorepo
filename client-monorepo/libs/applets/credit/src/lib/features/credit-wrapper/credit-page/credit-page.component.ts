import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CreditWindowPaymentService } from '../../../data-access/services/credit-window-payment.service';
import { RouterOutlet } from '@angular/router';
import { CreditServiceTypeService } from '../../credit/data-access/services/credit-service-type.service';

@Component({
  selector: 'app-credit-page',
  templateUrl: './credit-page.component.html',
  styleUrls: ['./credit-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class CreditPageComponent implements OnInit {
  creditWindowPaymentService = inject(CreditWindowPaymentService);
  serviceTypeService = inject(CreditServiceTypeService);

  ngOnInit(): void {
    this.serviceTypeService.setServiceType('credit');
    this.creditWindowPaymentService.attachCreditPayment();
  }
}
