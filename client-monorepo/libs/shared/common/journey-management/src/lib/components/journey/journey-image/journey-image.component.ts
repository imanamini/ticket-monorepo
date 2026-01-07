import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'common-journey-management-journey-image',
  standalone: true,
  imports: [CommonModule, ApiImageModule],
  templateUrl: './journey-image.component.html',
  styleUrl: './journey-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.d-none]': '!!!imageId()',
  },
})
export class JourneyImageComponent {
  imageId = input<string>();
}
