import {Component, ElementRef, inject, Inject, input, Input, PLATFORM_ID, ViewChild} from '@angular/core';
import {TimelineSteps} from '../../../models/timeline-steps';
import {UiDialogSimpleComponent} from '../../ui-dialogs/ui-dialog-simple/ui-dialog-simple.component';
import {MatDialog} from '@angular/material/dialog';
import {SwiperOptions} from 'swiper/types';
import {SwiperContainer} from 'swiper/swiper-element';
import {UiButtonComponent} from '../../ui-button/ui-button/ui-button.component';
import {isPlatformBrowser, NgClass, NgFor, NgIf} from '@angular/common';
import {SwiperDirective} from '../../../ui-directive/swiper.directive';
import {UrlService} from "../../../../website/services/url.service";

@Component({
  selector: 'app-ui-horizontal-flow',
  templateUrl: './ui-horizontal-flow.component.html',
  styleUrls: ['./ui-horizontal-flow.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiButtonComponent, SwiperDirective],
})
export class UiHorizontalFlowComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  title = input('');
  subtitle = input('');
  insurance = input(false);
  @Input()
  ctaLink: any = '';

  @Input()
  steps: TimelineSteps[] | any[] = [];

  @Input()
  firstCta: any;

  config: SwiperOptions = {
    slidesPerView: 1,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    allowTouchMove: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      744: {
        slidesPerView: 2,
      },
      280: {
        slidesPerView: 1,
      },
    },
  };

  urlService = inject(UrlService);

  constructor(private matDialog: MatDialog) {

  }

  openModal(data: any) {
    this.matDialog.open(UiDialogSimpleComponent, {
      width: '650px',
      data: {
        templateData: data,
      },
    });
  }

  openCtaLink(link: string) {
    if (link) {
      this.urlService.handleLink(link);
    }
  }
}
