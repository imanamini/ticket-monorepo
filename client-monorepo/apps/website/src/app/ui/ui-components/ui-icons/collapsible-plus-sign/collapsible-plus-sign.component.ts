import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-collapsible-plus-sign',
  templateUrl: './collapsible-plus-sign.component.html',
  styleUrls: ['./collapsible-plus-sign.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class CollapsiblePlusSignComponent {
  @Input()
  isOpen = false;

  @Input()
  plusClose = false;

  @Output()
  clicked = new EventEmitter();

  onClick() {
    this.clicked.emit();
  }
}
