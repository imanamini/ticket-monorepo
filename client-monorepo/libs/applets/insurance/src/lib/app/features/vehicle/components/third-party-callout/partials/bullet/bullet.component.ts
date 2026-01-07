import { Component, computed, input, Signal } from '@angular/core';

@Component({
  selector: 'bullet',
  standalone: true,
  imports: [],
  templateUrl: './bullet.component.html',
  styleUrl: './bullet.component.scss'
})
export class BulletComponent {

  constructor() {
  }

  diameter = input<number>(8);
  border = input<number>(0);

  largeCircleDiameter: Signal<number> = computed<number>(() => this.diameter() + (2 * this.border()));
}
