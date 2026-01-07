import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseRecommendation } from '../../../../api/digipay/models/recommendation/base-recommendation';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiRecommendationItemComponent } from '../ui-recommendation-item/ui-recommendation-item.component';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';

@Component({
  selector: 'app-ui-recommendations-list',
  templateUrl: './ui-recommendations-list.component.html',
  styleUrls: ['./ui-recommendations-list.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, UiRecommendationItemComponent, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiRecommendationsListComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  recommendations: BaseRecommendation[];

  @Input()
  boxTitle: string;

  @Output()
  itemClicked = new EventEmitter<BaseRecommendation>();

  @Input()
  displayStyle: 'ROW' | 'COLUMN' = 'COLUMN';

  config: SwiperOptions = {
    slideToClickedSlide: true,
    freeMode: true,
    spaceBetween: 16,
    slidesPerView: 'auto',
  };

  onItemClick(item: BaseRecommendation): void {
    this.itemClicked.emit(item);
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }
}
