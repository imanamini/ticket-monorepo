import { Component, Inject, OnInit } from '@angular/core';
import { RedirectService } from '../../../core/services/redirect.service';
import { RouteStateInterface } from '../../../core/services/route-state/route-state.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-activated',
  templateUrl: './wallet-activated.component.html',
  styleUrls: ['./wallet-activated.component.scss']
})
export class WalletActivatedComponent implements OnInit {

  gettingBack = false;

  constructor(
    private redirect: RedirectService,
    private router: Router,
    @Inject('RouteStateInterface') private routeStateService: RouteStateInterface,
  ) {
  }

  ngOnInit() {
    this.routeStateService.get('success').then(() => {
    }).catch(() => {
      // probably, user is not coming from the verification page
      this.router.navigateByUrl('/');
    });
  }

  backToMerchant() {
    this.gettingBack = true;
    this.redirect.setAndRedirect([], 'GET');
  }

  countdownFinished() {
    this.backToMerchant();
  }
}
