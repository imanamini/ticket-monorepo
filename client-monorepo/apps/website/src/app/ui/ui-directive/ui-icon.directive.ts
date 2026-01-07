import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUiIcon]',
  standalone: true,
})
export class UiIconDirective implements OnInit {
  @Input() icon: string;

  @Input() size = 16;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'width', `${this.size}px`);
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.size}px`);
    this.renderer.setStyle(this.el.nativeElement, 'background-size', 'contain');
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');

    // this.el.nativeElement.className = this.el.nativeElement.className
    //   .split(' ')
    //   .filter((cls: string) => !cls.startsWith('icon-'))
    //   .join(' ');

    if (this.icon) {
      this.renderer.addClass(this.el.nativeElement, this.icon);
    }
  }
}
