import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-sim-card',
  templateUrl: './ui-sim-card.component.html',
  styleUrls: ['./ui-sim-card.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class UiSimCardComponent {
  @Input()
  selected = false;

  @Output()
  clicked = new EventEmitter();

  @Input()
  simTitle: string;
  onClick(): void {
    this.clicked.emit();
  }
}
