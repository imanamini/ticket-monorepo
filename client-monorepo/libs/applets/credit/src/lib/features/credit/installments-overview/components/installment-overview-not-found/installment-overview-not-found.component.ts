import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-installments-overview-not-found',
  templateUrl: 'installment-overview-not-found.component.html',
  standalone: true,
  imports: [NgxButtonComponent, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentsOverviewNotFoundComponent {
  // Inputs
  title = input<string>('');
  description = input<string>('');
  ctaTitle = input<string | null>('');

  // Outputs
  ctaClicked = output();
}
