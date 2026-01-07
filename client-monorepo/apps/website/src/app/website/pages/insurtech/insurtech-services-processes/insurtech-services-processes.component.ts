import { ChangeDetectorRef, Component, effect, ElementRef, input, OnInit, signal, ViewChild } from '@angular/core';
import { InsuranceServicesProcesses } from '../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { StyledSwitchOption } from '../../../../ui/models/switch-option.model';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiSwiperTabsComponent } from '../../../../ui/ui-components/ui-swiper-tabs/ui-swiper-tabs/ui-swiper-tabs.component';
import { UiTabsComponent } from '../../../../ui/ui-components/ui-tabs/ui-tabs.component';
import { NgClass } from '@angular/common';
import { UiIconDirective } from '../../../../ui/ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-insurtech-services-processes',
  templateUrl: './insurtech-services-processes.component.html',
  styleUrls: ['./insurtech-services-processes.component.scss'],
  standalone: true,
  imports: [NgClass, UiTabsComponent, UiIconDirective, UiSwiperTabsComponent, UiButtonComponent, SwiperDirective, NgxIcon],
})
export class InsurtechServicesProcessesComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  insuranceServicesProcesses = input.required<InsuranceServicesProcesses>();
  activeIndex = input(0); // Kept as InputSignal
  internalActiveIndex = signal(0); // New internal signal to manage tab state
  activeSwitchPageIndex = signal(0);
  selectedSwitchOption = signal<StyledSwitchOption | undefined>(undefined);

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    slideToClickedSlide: true,
    allowTouchMove: true,
    spaceBetween: 16,
    centerInsufficientSlides: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      744: {
        slidesPerView: 2,
      },
      400: {
        slidesPerView: 1.5,
      },
      20: {
        direction: 'vertical',
        slidesPerView: 3,
        enabled: false,
      },
    },
  };

  constructor(private changeDetector: ChangeDetectorRef) {
    // Effect to synchronize internalActiveIndex with activeIndex input
    effect(
      () => {
        const newIndex = this.activeIndex();
        this.internalActiveIndex.set(newIndex);
        // Update selectedSwitchOption when activeIndex changes
        if (this.insuranceServicesProcesses().tabs[newIndex]) {
          this.selectedSwitchOption.set(
            this.translateSwitchOptions(this.insuranceServicesProcesses().tabs[newIndex].tabPanel.switchPages)[
              this.activeSwitchPageIndex()
            ],
          );
        }
        this.changeDetector.detectChanges();
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  ngOnInit(): void {
    // Initialize selectedSwitchOption
    this.selectedSwitchOption.set(
      this.translateSwitchOptions(this.insuranceServicesProcesses().tabs[this.internalActiveIndex()].tabPanel.switchPages)[
        this.activeSwitchPageIndex()
      ],
    );
  }

  changeTab(index: number) {
    this.activeSwitchPageIndex.set(0);
    this.internalActiveIndex.set(index); // Update internal signal instead of activeIndex
    this.selectedSwitchOption.set(this.translateSwitchOptions(this.insuranceServicesProcesses().tabs[index].tabPanel.switchPages)[0]);
    this.changeDetector.detectChanges();
  }

  translateSwitchOptions(switchOptions: any[]): Array<StyledSwitchOption> {
    return switchOptions.map((option, i) => ({
      label: option.switchPageTitle,
      value: i,
    }));
  }

  changeSwitchPageOption(option: number) {
    this.activeSwitchPageIndex.set(option);
    this.selectedSwitchOption.set(
      this.translateSwitchOptions(this.insuranceServicesProcesses().tabs[this.internalActiveIndex()].tabPanel.switchPages)[option],
    );
    this.changeDetector.detectChanges();
  }
}
