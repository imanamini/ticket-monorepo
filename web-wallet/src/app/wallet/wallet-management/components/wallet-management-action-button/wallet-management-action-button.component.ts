import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-management-action-button',
  templateUrl: './wallet-management-action-button.component.html',
  styleUrls: ['./wallet-management-action-button.component.scss']
})
export class WalletManagementActionButtonComponent {
  private router = inject(Router);

  navigateToIncreaseWithdrawal() {
    document.location.href = 'http://localhost:4200/service/cash-in';
    // this.router.navigate(['/service/cash-in']);
  }

}
