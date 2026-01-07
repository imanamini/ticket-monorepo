import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { EXPIRED_PASSWORD_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-expired-notice',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './expired-notice.component.html',
  styleUrl: './expired-notice.component.scss',
})
export class ExpiredNoticeComponent {
  navigationService = inject(WealthNavigationService);

  onBtnClicked() {
    this.navigationService.navigate([EXPIRED_PASSWORD_ROUTE], { queryParams: { expire: true } });
  }
}
