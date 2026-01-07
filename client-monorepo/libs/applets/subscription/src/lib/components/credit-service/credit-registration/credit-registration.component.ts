import { Component, EventEmitter, Output } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-credit-registration',
  templateUrl: './credit-registration.component.html',
  standalone: true,
  styleUrls: ['./credit-registration.component.scss'],
  imports: [NgxButtonComponent],
})
export class CreditRegistrationComponent {
  @Output() clickHandler: EventEmitter<any> = new EventEmitter<any>();
}
