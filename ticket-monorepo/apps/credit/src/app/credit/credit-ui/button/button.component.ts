import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'credit-ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Output()
  buttonClick = new EventEmitter();

  @Input()
  appearance: 'default' | 'outline' | 'green' | 'outline-primary' = 'default';

  @Input()
  disabled = false;

  @Input()
  styles = {};

  constructor() {
  }

  ngOnInit() {
  }


  clicked($event) {
    this.buttonClick.emit($event);
  }
}
