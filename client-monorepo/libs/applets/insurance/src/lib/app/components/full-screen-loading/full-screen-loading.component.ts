import { Component, input } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'full-screen-loading',
  standalone: true,
  imports: [
    NgxSpinnerModule
  ],
  templateUrl: './full-screen-loading.component.html',
  styleUrl: './full-screen-loading.component.scss'
})
export class FullScreenLoadingComponent {
  text = input<string>();
}
