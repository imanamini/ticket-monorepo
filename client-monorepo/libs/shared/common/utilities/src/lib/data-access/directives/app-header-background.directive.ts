import { AfterViewInit, Directive, ElementRef, input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

declare let FinisherHeader: any;

@Directive({
  selector: '[commonUtilitiesAppHeaderBackground]',
  standalone: true,
})
export class HeaderBackgroundDirective implements OnInit, AfterViewInit, OnDestroy {
  limited = input(false);
  page = input<'stores' | 'hub'>('hub');
  finisherScript = input<string | undefined>(undefined);
  finisher: any;
  private destroyed = false;
  private initTimeout: any;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.setStyles();
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
      this.initTimeout = null;
    }
    this.clearElements();
  }

  clearElements(): void {
    this.finisher?.clear();
    document.querySelector('#finisher_canvas')?.remove();
    document.querySelector('#app-header-tail')?.remove();
    document.querySelector('#app-header')?.remove();
    this.renderer.removeClass(this.el.nativeElement, 'finisher-header');
  }

  ngAfterViewInit() {
    this.addElements();
    this.initTimeout = setTimeout(() => {
      if (!this.destroyed && !this.limited()) {
        this.initFinisher();
      }
    });
  }

  private setStyles(): void {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
  }

  private addElements(): void {
    const headerDiv = this.renderer.createElement('div');
    this.renderer.addClass(headerDiv, 'app-header');
    this.renderer.setAttribute(headerDiv, 'id', 'app-header');
    const tail = this.renderer.createElement('div');
    this.renderer.addClass(tail, 'app-header-tail');
    this.renderer.setAttribute(tail, 'id', 'app-header-tail');
    this.renderer.addClass(this.el.nativeElement, 'finisher-header');
    this.renderer.addClass(this.el.nativeElement, this.page());
    this.renderer.appendChild(this.el.nativeElement, headerDiv);
    this.renderer.appendChild(this.el.nativeElement, tail);
  }

  private initFinisher(): void {
    if (this.destroyed) return;

    const finisherHeader = document.getElementsByClassName('finisher-header');
    if (finisherHeader.length) {
      try {
        this.finisher = new FinisherHeader(
          this.finisherScript()
            ? JSON.parse(this.finisherScript()!)
            : {
                count: 9,
                size: {
                  min: 400,
                  max: 800,
                  pulse: 0,
                },
                speed: {
                  x: {
                    min: 0,
                    max: 0.4,
                  },
                  y: {
                    min: 0,
                    max: 0.4,
                  },
                },
                colors: {
                  background: '#606060',
                  particles: ['#d5a0f9', '#040396', '#0f08d4', '#06f15a'],
                },
                blending: 'overlay',
                opacity: {
                  center: 0.45,
                  edge: 0.05,
                },
                skew: 0,
                shapes: ['c'],
              },
        );
      } catch (e) {
        // Silently fail if FinisherHeader initialization fails (e.g., element already removed)
        if (!this.destroyed) {
          console.info('FinisherHeader initialization failed:', e);
        }
      }
    }
  }
}
