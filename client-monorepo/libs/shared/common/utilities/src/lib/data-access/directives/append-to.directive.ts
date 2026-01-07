import { Directive, ElementRef, Inject, input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs';

@Directive({
  selector: '[commonUtilitiesAppendTo]',
  standalone: true,
})
export class AppendToDirective implements OnInit {
  commonUtilitiesAppendTo = input.required<string>();
  removable = input<boolean>(true);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initDirective();
  }

  initDirective(): void {
    let parentEl = this.document.querySelector(this.commonUtilitiesAppendTo());
    if (!parentEl) {
      parentEl = this.document.querySelector('body');
    }
    const currentEl = this.elementRef.nativeElement;
    currentEl.classList.add('appendTo');
    this.renderer.appendChild(parentEl, currentEl);
    if (this.removable()) {
      const routerSub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe({
        next: () => {
          this.renderer.removeChild(parentEl, currentEl);
          routerSub.unsubscribe();
        },
      });
    }
  }
}
