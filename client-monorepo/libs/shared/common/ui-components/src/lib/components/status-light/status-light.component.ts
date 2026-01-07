import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLightBordersEnum, StatusLightColorsEnum, StatusLightSizesEnum } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'common-ui-components-status-light',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-light.component.html',
  styleUrl: './status-light.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusLightComponent {
  showStatusLight = input<boolean>(false);
  statusSize = input<StatusLightSizesEnum>();
  statusColor = input<StatusLightColorsEnum>();
  statusBorderColor = input<StatusLightBordersEnum>();
  isAbsolute = input<boolean>(true);
}
