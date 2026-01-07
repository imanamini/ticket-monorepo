import { Component } from '@angular/core';

@Component({
  selector: 'early-settlement-no-ticket',
  templateUrl: './early-settlement-no-ticket.component.html',
  styleUrl: './early-settlement-no-ticket.component.scss'
})
export class EarlySettlementNoTicketComponent {
  exit() {
    const businessSettlementUrl: any = sessionStorage.getItem('businessSettlementUrl');
    if (businessSettlementUrl) {
      window.location.replace(businessSettlementUrl);
    }
  }

}
