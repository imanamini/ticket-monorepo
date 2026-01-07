import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JmConfig } from '@client-monorepo/common/journey-management';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-journey-management-journey-actions',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './journey-actions.component.html',
  styleUrl: './journey-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyActionsComponent {
  config = input<JmConfig>();
  primaryClick = output();
  secondaryClick = output();
}
