import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'common-rate-title',
  standalone: true,
  imports: [CommonModule, ApiImageModule],
  templateUrl: './rate-title.component.html',
  styleUrl: './rate-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateTitleComponent {
  titleImage = input<string | undefined>(undefined);
  title = input<string | undefined>(undefined);
}
