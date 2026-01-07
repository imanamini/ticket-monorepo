import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as Sentry from '@sentry/angular-ivy';
import { TgsSelectFeatureResponse } from '../../../data-access/models/tgs-select-feature-response';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UserCardTooltipComponent } from '../user-card-tooltip/user-card-tooltip.component';

@Component({
  selector: 'payment-checkout-hint',
  standalone: true,
  imports: [PipesModule, UserCardTooltipComponent],
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent {
  @Input()
  info!: TgsSelectFeatureResponse;
  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }
}
