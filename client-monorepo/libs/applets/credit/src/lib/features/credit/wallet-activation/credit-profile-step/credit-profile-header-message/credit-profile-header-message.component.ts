import { Component, input } from '@angular/core';

@Component({
  selector: 'app-credit-profile-header-message',
  templateUrl: './credit-profile-header-message.component.html',
  styleUrls: ['./credit-profile-header-message.component.scss'],
  standalone: true,
})
export class CreditProfileHeaderMessageComponent {
  headerMessage = input<{
    content: string;
    color: string;
    bgColor: string;
    strokeColor: string;
  }>();
}
