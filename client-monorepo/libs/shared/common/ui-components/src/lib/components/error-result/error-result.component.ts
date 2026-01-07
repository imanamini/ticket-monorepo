import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'common-ui-components-error-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-result.component.html',
  styleUrl: './error-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorResultComponent {
  title = input<string>('');
  description = input<string>('');
  subDescription = input<string>('');
}
