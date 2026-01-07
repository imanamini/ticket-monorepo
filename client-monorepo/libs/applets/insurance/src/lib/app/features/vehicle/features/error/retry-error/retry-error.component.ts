import { Component, output } from '@angular/core';
import {
  ErrorRetryComponent
} from '../../third-party/features/price-card-list/components/error-retry/error-retry.component';
import { InsButtonComponent } from '../../../../../components/ins-button/ins-button.component';
import { ActionButtonsComponent } from '../../../../../components/action-buttons/action-buttons.component';

@Component({
  selector: 'retry-error',
  standalone: true,
  imports: [
    ErrorRetryComponent,
    InsButtonComponent,
    ActionButtonsComponent
  ],
  templateUrl: './retry-error.component.html',
  styleUrl: './retry-error.component.scss'
})
export class RetryErrorComponent {
  retryButtonClicked = output();
}
