import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { RECOMMENDATION_TYPES, RecommendationData } from '@client-monorepo/daily-fintech/recommendation';
import { OnHoldDirective } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'daily-fintech-recommendation-item',
  standalone: true,
  imports: [CommonModule, PipesModule, ApiImageModule, DpIconComponent, OnHoldDirective, NgxButtonComponent],
  templateUrl: './daily-fintech-recommendation-item.component.html',
  styleUrls: ['./daily-fintech-recommendation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFintechRecommendationItemComponent {
  // Inputs
  item = input<RecommendationData>({} as RecommendationData);
  clickable = input(false);
  itemType = input<RECOMMENDATION_TYPES>({} as RECOMMENDATION_TYPES);

  // Outputs
  itemClick = output<RecommendationData>();
  handleOnHold = output<any>();

  /**
   * Number click handler
   */
  numberClick(recentNumberData: RecommendationData, event?: Event) {
    event?.stopPropagation();
    this.itemClick.emit(recentNumberData);
  }

  /**
   * More info click
   */
  handleHold(event: Event | null) {
    event?.stopPropagation();
    this.handleOnHold.emit(event);
  }
}
