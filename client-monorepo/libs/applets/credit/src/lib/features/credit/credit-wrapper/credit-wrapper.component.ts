import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../credit-environment.interface';
import { CreditRouteStateService } from '../data-access/services/route-state/credit-route-state.service';
import { CloseServiceUrlStateKey, CreditNavigationService } from '../data-access/services/credit-navigation.service';
import { CreditWrapperWithLocalStyleComponent } from './credit-wrapper-with-local-style.component';
import { CreditWrapperWithGlobalStyleComponent } from './credit-wrapper-with-global-style.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-credit-wrapper',
  templateUrl: './credit-wrapper.component.html',
  standalone: true,
  imports: [RouterOutlet, CreditWrapperWithGlobalStyleComponent, CreditWrapperWithLocalStyleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWrapperComponent {
  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    public creditEnvironment: CreditEnvironmentInterface,
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateService,
    private creditNavigationService: CreditNavigationService,
  ) {
    this.addCloseServiceRedirectUrl();
  }

  private addCloseServiceRedirectUrl() {
    this.routeStateService
      .get(CloseServiceUrlStateKey)
      .then((url) => this.creditNavigationService.setCloseServiceRedirectUrl(url))
      .catch(() => this.creditNavigationService.setCloseServiceRedirectUrl());
  }
}
