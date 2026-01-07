import { Component } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'waiting-pages',
  standalone: true,
  imports: [
    NgxSpinnerModule
  ],
  templateUrl: './waiting-pages.component.html',
  styleUrl: './waiting-pages.component.scss'
})
export class WaitingPagesComponent {

}
