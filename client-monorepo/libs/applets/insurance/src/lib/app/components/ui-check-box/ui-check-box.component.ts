import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-check-box',
  templateUrl: './ui-check-box.component.html',
  styleUrls: ['./ui-check-box.component.scss'],
  standalone: true
})
export class UiCheckBoxComponent {

  @Input()
  checked = false;

  @Input()
  name = '';

  @Input()
  title = '';

  @Output()
  clicked = new EventEmitter();
}
