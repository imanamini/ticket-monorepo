import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'credit-ui-alert-message-box',
  templateUrl: './alert-message-box.component.html',
  styleUrls: ['./alert-message-box.component.scss']
})
export class AlertMessageBoxComponent implements OnInit {

  @Input() status: 'disabled' | 'primary' | 'success' | 'danger' | 'warning';

  constructor() { }

  ngOnInit() {
  }

}
