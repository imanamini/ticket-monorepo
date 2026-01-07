import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JmConfig } from '@client-monorepo/common/journey-management';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'common-journey-management-journey-top-section',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, DpIconComponent],
  templateUrl: './journey-top-section.component.html',
  styleUrl: './journey-top-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.d-none]': '(!(config().data?.badges) || !config().data?.badges.length) && !placeHolder()',
  },
})
export class JourneyTopSectionComponent {
  config = input<JmConfig>();
  placeHolder = input(true);
  classes = input<string>('');
}
