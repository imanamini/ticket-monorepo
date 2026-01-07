import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.scss']
})
export class UiCheckboxComponent implements OnInit {

  @Input()
  checked = false;

  @Output()
  changed = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.checked = !this.checked;
    this.changed.emit(this.checked);
  }
}
