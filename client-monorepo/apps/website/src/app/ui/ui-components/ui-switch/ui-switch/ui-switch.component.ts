import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-switch',
  templateUrl: './ui-switch.component.html',
  styleUrls: ['./ui-switch.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class UiSwitchComponent {
  @Input()
  isOn = false;

  @Output()
  changed = new EventEmitter<boolean>();

  onClick() {
    this.isOn = !this.isOn;
    this.changed.next(this.isOn);
  }
}
