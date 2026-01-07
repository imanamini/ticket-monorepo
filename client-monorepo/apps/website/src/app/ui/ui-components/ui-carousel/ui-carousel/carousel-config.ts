export interface CarouselConfig {
  hasNavigation?: boolean;
  loop?: boolean;
  navText?: Array<string>;
  navBtnNext?: HTMLDivElement;
  navBtnPrev?: HTMLDivElement;
  autoWidth?: boolean;
  centerSlides?: boolean;
  gap?: number;
  hasCustomPagination?: boolean;
  navSpeed?: number;
  breakpoints?: { [minWidth: number]: CarouselConfig };
  hasAutoPlay?: boolean;
  autoplaySpeed?: number | boolean;
  autoplayDelay?: number;
  slidesPerView?: number | string;
  rtl?: boolean;
  autoHeight?: boolean;
  minWrapperHeight?: string;
  mouseDrag?: boolean;
  touchDrag?: boolean;
  pullDrag?: boolean;
}

export const CONFIG_TRANSLATOR = {
  hasNavigation: 'nav',
  loop: 'loop',
  navText: 'navText',
  autoWidth: 'autoWidth',
  centerSlides: 'center',
  gap: 'margin',
  hasCustomPagination: 'dots',
  navSpeed: 'navSpeed',
  breakpoints: 'responsive',
  hasAutoPlay: 'autoplay',
  autoplaySpeed: 'autoplaySpeed',
  autoplayDelay: 'autoplayTimeout',
  slidesPerView: 'items',
  rtl: 'rtl',
  autoHeight: 'autoHeight',
  mouseDrag: 'mouseDrag',
  touchDrag: 'touchDrag',
  pullDrag: 'pullDrag',
};
