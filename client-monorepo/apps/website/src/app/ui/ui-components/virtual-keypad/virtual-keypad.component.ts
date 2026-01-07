import { Component, EventEmitter, Output } from '@angular/core';
import { VirtualKeypadService } from './virtual-keypad.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-virtual-keypad',
  templateUrl: './virtual-keypad.component.html',
  styleUrls: ['./virtual-keypad.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class VirtualKeypadComponent {
  @Output()
  emitPress: EventEmitter<string> = new EventEmitter();

  constructor(private service: VirtualKeypadService) {}

  isOpen() {
    return this.service.open.getValue();
  }

  buttonClick(key: string) {
    this.emitPress.emit(key);
  }
}
