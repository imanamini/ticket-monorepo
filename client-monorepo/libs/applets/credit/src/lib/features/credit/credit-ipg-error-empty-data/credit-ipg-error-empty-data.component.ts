import { Component, inject } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-ipg-error-empty-data',
  standalone: true,
  templateUrl: 'credit-ipg-error-empty-data.component.html',
  imports: [NgxStatusResultModule],
})
export class CreditIpgErrorEmptyDataComponent {
  private router = inject(Router);

  onCta() {
    this.router.navigateByUrl('/', {
      state: {
        customLinkForBack: '/',
      },
    });
  }
}
