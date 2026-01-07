import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[commonUiCarouselSlide]',
  standalone: true,
})
export class CarouselSlideDirective {
  @HostBinding('class.active') isActive = false;
  @HostBinding('class.is-next') isNext = false;
  @HostBinding('class.is-prev') isPrev = false;
  @HostBinding('class.carousel-item') defaultClass = true;

  @Input() customStyle: { [key: string]: string } = {};

  @HostBinding('style')
  get style(): { [key: string]: string } {
    return this.customStyle;
  }

  constructor(public element: ElementRef) {
  }
}
