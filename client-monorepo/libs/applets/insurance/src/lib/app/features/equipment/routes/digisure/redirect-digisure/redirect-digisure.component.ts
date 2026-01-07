import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INSURANCE_APP_PREFIX } from '../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'redirect-digisure',
  templateUrl: './redirect-digisure.component.html',
  standalone: true,
  styleUrls: ['./redirect-digisure.component.scss']
})
export class RedirectDigisureComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    const path = this.route.snapshot.url[0].path;
    if (queryParams.hasOwnProperty('id')) {
      this.router.navigate([INSURANCE_APP_PREFIX + '/equipment/unbundled/payment-result'], {queryParams: {providerId: queryParams.id}}).then();
    } else {
      this.router.navigate([INSURANCE_APP_PREFIX + '/equipment/unbundled/home'], {queryParams: {code: path}}).then();
    }
  }

}
