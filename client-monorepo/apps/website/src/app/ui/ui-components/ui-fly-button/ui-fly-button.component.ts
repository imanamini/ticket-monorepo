import { Component, HostListener, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-fly-button',
  templateUrl: './ui-fly-button.component.html',
  styleUrls: ['./ui-fly-button.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class UiFlyButtonComponent {
  fixed = false;

  @Input() endFixed = false;
  @Input() startFixed = 50;

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    if (!this.endFixed) {
      const height = window.innerHeight;
      const scrollBottom = window.pageYOffset + height;
      this.fixed = scrollBottom > height + this.startFixed;
    } else {
      this.fixed = false;
    }
  }
}
