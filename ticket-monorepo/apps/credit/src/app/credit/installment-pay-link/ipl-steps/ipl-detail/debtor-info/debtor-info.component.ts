import { Component, input } from '@angular/core';
import { IplFundProviderComponent } from '../../../ipl-fund-provider/ipl-fund-provider.component';

@Component({
  selector: 'app-debtor-info',
  standalone: true,
  imports: [
    IplFundProviderComponent
  ],
  templateUrl: './debtor-info.component.html',
  styleUrl: './debtor-info.component.scss'
})
export class DebtorInfoComponent {

  // Inputs
  fundProviderBusinessId = input.required<string>();
  title = input.required<string>();
  fullName = input<string>();
}
