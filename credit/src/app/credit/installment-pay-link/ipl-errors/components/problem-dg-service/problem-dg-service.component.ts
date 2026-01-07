import { Component, OnInit } from '@angular/core';
import { Buttons, NgxStatusResultModule } from '@digipay/ngx-status-result';

@Component({
  selector: 'problem-dg-service',
  standalone: true,
  styleUrl: '../../ipl-errors.style.scss',
  templateUrl: './problem-dg-service.component.html',
  imports: [
    NgxStatusResultModule
  ]
})

export class ProblemDgServiceComponent implements OnInit {

  button: Buttons[] = [];

  onClick() {

  }

  ngOnInit() {
    this.button = [{
      id: 'primary',
      style: 'tinted-on-elevated',
      label: 'تلاش دوباره',
      mode: 'form'
    }];
  }
}
