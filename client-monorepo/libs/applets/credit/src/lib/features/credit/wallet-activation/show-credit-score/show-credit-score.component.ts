import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { ShowCreditScoreModel } from './show-credit-score.model';
import { Router } from '@angular/router';
import { CreditRouteStateInterface } from '../../data-access/services/route-state/credit-route-state.interface';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditNavigationService } from '../../data-access/services/credit-navigation.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditScoreCircleComponent } from '../../components/credit-score-circle/credit-score-circle.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-show-credit-score',
  templateUrl: './show-credit-score.component.html',
  styleUrls: ['./show-credit-score.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditScrollableViewComponent, CreditScoreCircleComponent, NgxButtonComponent],
})
export class ShowCreditScoreComponent implements OnInit {
  data = signal<ShowCreditScoreModel | null>(null);
  creditHomeUrl = signal<string | null>(null);

  private creditNavigationService = inject(CreditNavigationService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {
    this.creditHomeUrl.set(this.creditUrlService.getInnerServicePath('/overview'));
  }

  ngOnInit() {
    this.routeStateService
      .get('data')
      .then((data) => {
        this.data.set(data);
      })
      .catch(() => {
        this.creditNavigationService.closeService();
      });
  }

  buttonClick() {
    this.router.navigateByUrl(this.data()?.backUrl!, {
      state: this.data()?.backRouteState,
    });
  }
}
