import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScrollToAnchor]',
  standalone: true,
})
export class ScrollToAnchorDirective {
  @Input() appScrollToAnchor: string; // Input property to dynamically set the ID
  @Input() block: 'start' | 'end' | 'center' | 'nearest' = 'center';
  @Input() behavior: 'auto' | 'smooth' = 'auto';
  @HostListener('click') onClick() {
    this.scrollToTarget();
  }

  scrollToTarget() {
    if (this.appScrollToAnchor) {
      const targetElement = document.getElementById(this.appScrollToAnchor);
      if (targetElement) {
        targetElement.scrollIntoView({ block: this.block, inline: 'nearest', behavior: this.behavior });
      }
    }
  }
}
