import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumServicesOutputModel } from '@client-monorepo/applets/auth';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';

@Component({
  selector: 'auth-applet-premium-service',
  standalone: true,
  imports: [CommonModule, NgxCheckboxComponent],
  templateUrl: './premium-service.component.html',
  styleUrl: './premium-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumServiceComponent {
  title = input.required<string>();
  description = input.required<string>();
  image = input.required<string>();
  id = input.required<number>();

  checked = false;
  selectedChange = output<PremiumServicesOutputModel>();
}
