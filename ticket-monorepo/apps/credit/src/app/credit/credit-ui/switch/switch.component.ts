import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'credit-ui-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  @Input()
  isOn = false;

  @Input()
  disabled: boolean;

  @Output()
  clicked = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  emitClick($event) {
    if (this.disabled) {
      return;
    }
    this.clicked.emit($event);
  }

}
