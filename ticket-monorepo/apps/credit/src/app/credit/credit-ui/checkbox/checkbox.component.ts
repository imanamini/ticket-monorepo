import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: '[uiCheckbox]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input()
  isChecked = false;

  @Output()
  clicked = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  clickHandler() {
    this.clicked.emit();
  }

}
