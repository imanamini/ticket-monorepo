import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-total-installments-error',
  templateUrl: './total-installments-error.component.html',
  styleUrl: './total-installments-error.component.scss',
  standalone: true,
  imports: [NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalInstallmentsErrorComponent {
  onRetry = output();
}
