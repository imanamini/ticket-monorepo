import { OwlOptions } from 'ngx-owl-carousel-o';

export const CUSTOM_OPTION_SWIPER: OwlOptions = {
  center: true,
  loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: false,
  dots: true,
  nav: false,
  rtl: true,
  navSpeed: 500,
  autoWidth: true,
  responsive: {
    0: {
      items: 1
    }
  },
};
