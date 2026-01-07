import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimelineSteps} from "../../../models/timeline-steps";
import {SwiperOptions} from "swiper/types";
import {MatDialog} from "@angular/material/dialog";
import {UiDialogSimpleComponent} from "../../ui-dialogs/ui-dialog-simple/ui-dialog-simple.component";
import {UrlService} from "../../../../website/services/url.service";

@Component({
  selector: 'app-ui-vertical-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-vertical-flow.component.html',
  styleUrl: './ui-vertical-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiVerticalFlowComponent {
  @Input()
  title: string = '';

  @Input()
  subtitle: string = '';

  @Input()
  ctaLink: any = '';

  @Input()
  insurance: boolean = false;

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
    navigation: {
      nextEl: '.horizontal-flow-button-prev',
      prevEl: '.horizontal-flow-button-next',
    },
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      744: {
        slidesPerView: 3,
      },
      280: {
        slidesPerView: 1,
      }
    }
  };

  urlService = inject(UrlService);

  constructor(private matDialog: MatDialog) {
  }

  openCtaLink(link: string) {
    if (link) {
      this.urlService.handleLink(link);
    }
  }

  openModal(data: any) {
    this.matDialog.open(UiDialogSimpleComponent, {
      width: '650px',
      data: {
        templateData: data,
      }
    });
  }
}
