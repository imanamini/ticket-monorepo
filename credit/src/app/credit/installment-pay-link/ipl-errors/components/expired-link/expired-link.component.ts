import { Component, OnInit } from '@angular/core';
import { Buttons, NgxStatusResultModule } from '@digipay/ngx-status-result';
import { IplCalloutComponent } from '../../../ipl-callout/ipl-callout.component';

@Component({
  selector: 'expired-link',
  standalone: true,
  styleUrls: ['../../ipl-errors.style.scss', '../../../ipl.style.scss'],
  templateUrl: 'expired-link.component.html',
  imports: [
    NgxStatusResultModule,
    IplCalloutComponent
  ]
})

export class ExpiredLinkComponent implements OnInit {

  button: Buttons[] = [];

  onClick() {

  }

  ngOnInit() {
    this.button = [{
      id: 'primary',
      style: 'tinted-on-elevated',
      label: 'درخواست لینک جدید',
      mode: 'form'
    }];
  }

}
