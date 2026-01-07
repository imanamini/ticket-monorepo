import { Component, input, output } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-footer-pay',
  standalone: true,
  imports: [
    PipesModule,
    NgxButtonComponent
  ],
  templateUrl: './footer-pay.component.html',
  styleUrl: './footer-pay.component.scss'
})
export class FooterPayComponent {
  buttonText = input<string>('پرداخت');
  amount = input<number>(0);
  showAmount = input<boolean>(true);
  disabled = input<boolean>(false);

  onActionClick = output();
}
