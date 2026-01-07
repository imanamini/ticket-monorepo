import { Component, inject } from '@angular/core';

import { LOGIN_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-session-expired-notice',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './session-expired-notice.component.html',
  styleUrl: './session-expired-notice.component.scss',
})
export class SessionExpiredNoticeComponent {
  navigationService = inject(WealthNavigationService);

  onBtnClicked() {
    this.navigationService.navigate([LOGIN_ROUTE]);
  }
}
