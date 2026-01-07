import { Component, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class UiButtonComponent implements OnInit {

  @Input()
  disabled = false;

  @Input()
  appearance: 'DEFAULT' | 'OUTLINE-BLUE' | 'OUTLINE-STEEL' | 'GRAY-STYLE' | 'BLUE-TEXT' = 'DEFAULT';

  backgroundColor = input<string>(null, { alias: 'background-color' });

  @Output()
  clicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick($event): void {
    this.clicked.emit($event);
  }

}
