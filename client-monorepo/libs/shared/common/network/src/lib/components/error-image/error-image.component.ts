import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorImageType } from '../../data-access/models/error-config.model';

@Component({
  selector: 'common-network-error-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorImageComponent {
  type = input<ErrorImageType | undefined>(ErrorImageType.TYPE_1);
  protected readonly ErrorImageType = ErrorImageType;
}
