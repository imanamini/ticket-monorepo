import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'credit-ui-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {

  @Input()
  size = '16px';

  @Input()
  checked: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
