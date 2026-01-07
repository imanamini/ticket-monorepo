import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalSwiperComponent } from './horizontal-swiper/horizontal-swiper.component';
import { HorizontalSwipeItemDirective } from './horizontal-swiper/horizontal-swipe-item.directive';

@NgModule({
  declarations: [
    HorizontalSwiperComponent,
    HorizontalSwipeItemDirective,
  ],
  exports: [
    HorizontalSwiperComponent,
    HorizontalSwipeItemDirective,
  ],
  imports: [
    CommonModule
  ]
})
export class UiScrollerModule {
}
