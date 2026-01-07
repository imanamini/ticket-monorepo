import { AfterViewInit, Component, effect, ElementRef, Inject, input, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { InsurtechTemplateData } from '../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { NgClass, ViewportScroller } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-insurtech-how',
  templateUrl: './insurtech-how.component.html',
  styleUrls: ['./insurtech-how.component.scss'],
  standalone: true,
  imports: [NgClass, UiHorizontalFlowComponent, UiButtonComponent, SwiperDirective],
})
export class InsurtechHowComponent implements OnInit, AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  templateData = input<InsurtechTemplateData | null>(null);
  selectedTab = signal(0);
  selectedStep = signal(0);
  screenWidth = signal(0);
  index = signal(0);

  configTabs: SwiperOptions = {
    slideToClickedSlide: true,
    slidesPerView: 'auto',
  };

  constructor(
    public scroller: ViewportScroller,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    // Effect to handle screenWidth changes and initialize selectedStep
    effect(() => {
      if (this.screenWidth() < 557) {
        this.selectedStep.set(-1);
      } else {
        this.selectedStep.set(0);
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
    }
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index();
  }

  changeStep(stepIndex: number) {
    if (this.selectedStep() === stepIndex) {
      this.selectedStep.set(-1);
    } else {
      this.selectedStep.set(stepIndex);
      of('')
        .pipe(delay(0))
        .subscribe({
          next: () => {
            this.scroller.scrollToAnchor('steps');
          },
        });
    }
    this.selectedTab.set(0);
  }

  changeTab(tabIndex: number) {
    this.selectedTab.set(tabIndex);
    this.index.set(tabIndex);
  }

  slideChange(swiper: any) {
    this.index.set(swiper.detail[0].activeIndex);
    this.selectedTab.set(swiper.detail[0].activeIndex);
  }
}
