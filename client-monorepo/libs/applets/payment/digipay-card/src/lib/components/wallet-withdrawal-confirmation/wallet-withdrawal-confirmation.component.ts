import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'digipay-card-applet-wallet-withdrawal-confirmation',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent,DpIconComponent],
  templateUrl: './wallet-withdrawal-confirmation.component.html',
  styleUrl: './wallet-withdrawal-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletWithdrawalConfirmationComponent {
  router=inject(Router);
  approve(){
    this.router.navigateByUrl('/card/request/personal-info');
  }
}
