import { Component } from '@angular/core';
import { BackToOriginService } from '../../services/back-to-origin.service';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent],
})
export class UnauthorizedComponent {
  constructor(private backToOrigin: BackToOriginService) {}

  goBack() {
    this.backToOrigin.goBackToOrigin();
  }
}
