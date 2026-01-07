import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JmConfig } from '@client-monorepo/common/journey-management';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { JourneyActionsComponent } from '../journey-actions/journey-actions.component';
import { JourneyImageComponent } from '../journey-image/journey-image.component';
import { JourneyTopSectionComponent } from '../journey-top-section/journey-top-section.component';
import { JourneyProgressComponent } from '../journey-progress/journey-progress.component';

@Component({
  selector: 'common-journey-management-journey-manager',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    NgxSkeletonLoadingComponent,
    JourneyActionsComponent,
    JourneyImageComponent,
    JourneyTopSectionComponent,
    JourneyProgressComponent,
  ],
  templateUrl: './journey-manager.component.html',
  styleUrl: './journey-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyManagerComponent {
  config = input<JmConfig>();
  isLoading = input<boolean>(false);
  primaryClicked = output();
  secondaryClicked = output();
}
