import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';

@Component({
  selector: 'app-user-exist-with-another-phone-number',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './user-exist-with-another-phone-number.component.html',
  styleUrl: './user-exist-with-another-phone-number.component.scss',
})
export class UserExistWithAnotherPhoneNumberComponent implements OnInit {
  phoneNumber: any;
  navigationService = inject(WealthNavigationService);
  activateRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((params) => {
      const splitedNumber = params['number'].split('*****');
      this.phoneNumber = splitedNumber[1] + '*****' + splitedNumber[0];
    });
  }

  onClose() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
}
