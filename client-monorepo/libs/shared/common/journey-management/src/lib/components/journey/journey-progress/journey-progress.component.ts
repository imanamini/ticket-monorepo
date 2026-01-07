import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JmConfig } from '@client-monorepo/common/journey-management';
import { ProgressbarComponent } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'common-journey-management-journey-progress',
  standalone: true,
  imports: [CommonModule, ProgressbarComponent],
  templateUrl: './journey-progress.component.html',
  styleUrl: './journey-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyProgressComponent {
  config = input<JmConfig>();
  mode = input<'full' | 'mini'>('full');
}
