import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { WarrantyTemplateData } from '../../../../api/clients/models/templates/warranty/warranty-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../ui/ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { delay, of } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { NgxIcon } from '@digipay/ngx-icon';

register();
@Component({
  selector: 'app-warranty-intro',
  templateUrl: './warranty-intro.component.html',
  styleUrls: ['./warranty-intro.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiButtonComponent, UiIconDirective, SwiperDirective, NgxIcon],
})
export class WarrantyIntroComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  data!: Page<WarrantyTemplateData>;

  selectedTab = 0;

  showSwiper = true;

  configCategories: SwiperOptions = {
    slideToClickedSlide: true,
    slidesPerView: 'auto',
  };

  config: SwiperOptions = {
    slidesPerView: 1,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    allowTouchMove: false,
    autoHeight: true,
  };

  constructor(private changeDetector: ChangeDetectorRef) {}

  changeTab(tabIndex: number) {
    this.selectedTab = tabIndex;
    this.showSwiper = false;
    this.changeDetector.detectChanges();
    of('')
      .pipe(delay(0))
      .subscribe({
        next: () => {
          this.showSwiper = true;
          this.changeDetector.detectChanges();
        },
      });
  }
}
