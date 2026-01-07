import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JmConfig } from '@client-monorepo/common/journey-management';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { JourneyTopSectionComponent } from '../../journey/journey-top-section/journey-top-section.component';
import { OnHoldDirective } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-journey-management-next-action',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent, JourneyTopSectionComponent, OnHoldDirective, NgxButtonComponent],
  templateUrl: './next-action.component.html',
  styleUrl: './next-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextActionComponent {
  config = input<JmConfig>();
  isLoading = input<boolean>(false);
  primaryClicked = output();
  secondaryClicked = output();
}
