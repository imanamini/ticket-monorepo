import { Component, EventEmitter, input, output, Output } from '@angular/core';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';

@Component({
  selector: 'error-retry',
  standalone: true,
  imports: [
    InsIconComponent
  ],
  templateUrl: './error-retry.component.html',
  styleUrl: './error-retry.component.scss'
})
export class ErrorRetryComponent {
  showRetryButton = input<boolean>(true, {alias: 'show-retry-icon'});
  retry = output<void>();
  protected readonly IconEnum = IconEnum;
}
