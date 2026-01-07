import { Component, input, output } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'subscription-header',
  standalone: true,
  imports: [
    NgxIcon
  ],
  templateUrl: './subscription-header.component.html',
  styleUrl: './subscription-header.component.scss'
})
export class SubscriptionHeaderComponent {
  title = input.required<string>();
  showBackIcon = input<boolean>(true);
  closeIconClicked = output();

  handleCloseIconClicked(): void {
    this.closeIconClicked.emit();
  }
}
