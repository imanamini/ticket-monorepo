import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'toll-applet-insufficient-wallet-balance-message',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './insufficient-wallet-balance-message.component.html',
  styleUrl: './insufficient-wallet-balance-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsufficientWalletBalanceMessageComponent {
  route = inject(Router);

  navigateToWalletBalance() {
    this.route.navigate(['cash-in']).then();
  }
}
